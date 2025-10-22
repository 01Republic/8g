import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useEdgesState,
  type Connection,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { workflowNodeTypes } from "~/client/admin/workflowBuilder/nodes";
import type { Workflow, Block } from "scordi-extension";
import { AllBlockSchemas } from "scordi-extension";
import { PaletteSheet } from "./PaletteSheet";
import { ResultPanel } from "./ResultPanel";
import { WorkspaceResultPanel } from "./WorkspaceResultPanel";
import { MembersResultPanel } from "./MembersResultPanel";
import { PlanCycleResultPanel } from "./PlanCycleResultPanel";
import { BillingHistoryResultPanel } from "./BillingHistoryResultPanel";
import { WorkflowBuilderHeader } from "./WorkflowBuilderHeader";
import { blockLabels } from "./nodes";
import { runWorkflow } from "~/models/workflow/WorkflowRunner";
import type { WorkflowType } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import { buildWorkflowJson } from "~/models/workflow/WorkflowBuilder";
import type { WorkflowEdge, SwitchEdgeData } from "~/models/workflow/types";
import { ConditionalEdge } from "./edges/ConditionalEdge";

import { getLayoutedElements } from "./utils/autoLayout";
import type { FormWorkflow } from "~/models/integration/types";
import { SaveDialog } from "./SaveDialog";
import { convertWorkflowToNodesAndEdges } from "./utils/workflowConverter";
import { useNodesState } from "@xyflow/react";
import { VariablesDialog } from "./VariablesDialog";
import { VariablesPreviewPanel } from "./VariablesPreviewPanel";
import { EdgeConfigDialog } from "./edges/EdgeConfigDialog";

interface Product {
  id: number;
  nameKo: string;
  nameEn: string;
}

interface WorkflowBuilderPageProps {
  workflowId?: number;
  initialWorkflow?: {
    id: number;
    description: string;
    meta: FormWorkflow;
    productId: number;
  } | null;
  onSave: (payload: {
    workflowId?: number;
    productId: number;
    description: string;
    meta: FormWorkflow;
    type?: WorkflowType;
  }) => void;
  isSaving: boolean;
  type?: WorkflowType; // Workspace API 타입 지정
  products: Product[];
}

export default function WorkflowBuilderPage({
  workflowId,
  initialWorkflow,
  onSave,
  isSaving,
  type: initialApiType,
  products,
}: WorkflowBuilderPageProps) {
  // 초기 노드/엣지 변환
  const initialData = React.useMemo(() => {
    if (initialWorkflow?.meta) {
      return convertWorkflowToNodesAndEdges(initialWorkflow.meta as Workflow);
    }
    return { nodes: [], edges: [] };
  }, [initialWorkflow]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(
    initialData.edges,
  );
  const [selectedEdge, setSelectedEdge] = React.useState<WorkflowEdge | null>(
    null,
  );
  const [edgeDialogOpen, setEdgeDialogOpen] = React.useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [description, setDescription] = React.useState(
    initialWorkflow?.description || "",
  );
  const [type, setApiType] = React.useState<WorkflowType>(
    initialApiType || 'WORKFLOW',
  );
  const [productId, setProductId] = React.useState<number>(
    initialWorkflow?.productId || 1, // 기본값 1 (나중에 UI에서 선택 가능하도록)
  );

  // Variables 관리
  const [variables, setVariables] = React.useState<Record<string, any>>(
    initialWorkflow?.meta?.vars || {},
  );
  const [variablesDialogOpen, setVariablesDialogOpen] = React.useState(false);

  const onConnect = React.useCallback(
    (connection: Connection) => {
      const newEdge: WorkflowEdge = {
        ...connection,
        id: `${connection.source}-${connection.target}-${Date.now()}`,
        type: "conditional",
        data: {
          isDefault: true,
          conditionLabel: "default",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  const [targetUrl, setTargetUrl] = React.useState<string>(
    initialWorkflow?.meta?.targetUrl ||
      (typeof window !== "undefined" ? window.location.href : ""),
  );
  const [isRunning, setIsRunning] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [executionResults, setExecutionResults] = React.useState<any>(null);
  const rfRef = React.useRef<unknown>(null);
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  const buildWorkflow = React.useCallback((): FormWorkflow => {
    const workflow = buildWorkflowJson(nodes, edges, targetUrl);

    const formWorkflow: FormWorkflow = {
      version: workflow.version,
      start: workflow.start,
      steps: workflow.steps,
      targetUrl: workflow.targetUrl,
      vars: variables,
    };

    return formWorkflow;
  }, [nodes, edges, targetUrl, variables]);

  const run = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const workflow = buildWorkflow();

      // targetUrl에서 variables 치환
      let evaluatedUrl =
        targetUrl ||
        (typeof window !== "undefined" ? window.location.href : "");
      if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(`\\$\\{vars\\.${key}\\}`, "g");
          const replacement =
            typeof value === "string" ? value : JSON.stringify(value);
          evaluatedUrl = evaluatedUrl.replace(regex, replacement);
        });
      }

      const res = await runWorkflow({
        evaluatedUrl,
        workflow,
        closeTabAfterCollection: true,
        activateTab: true,
        variables, // variables 전달
        type, // API 타입 전달
      });
      setResult(res);
      setExecutionResults(res);

      // nodes의 data에 executionResults 추가
      setNodes((nds) => {
        const updatedNodes = nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            executionResults: res,
          },
        }));
        console.log("🔄 Updated nodes with executionResults:", updatedNodes);
        return updatedNodes;
      });
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setIsRunning(false);
    }
  };

  const addNode = React.useCallback(
    (type: string, data: any) => {
      const inst: any = rfRef.current as any;
      const vp = inst?.getViewport?.();
      const position = vp
        ? { x: -vp.x / vp.zoom + 120, y: -vp.y / vp.zoom + 80 }
        : { x: 120, y: 80 };
      const id = `node_${Date.now()}`;
      const newNode = { id, type, position, data };
      setNodes((nds) => nds.concat(newNode));
      setPaletteOpen(false);
    },
    [setNodes],
  );

  const onEdgeDoubleClick = React.useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge as WorkflowEdge);
      setEdgeDialogOpen(true);
    },
    [],
  );

  const handleEdgeSave = React.useCallback(
    (data: SwitchEdgeData) => {
      if (selectedEdge) {
        setEdges((eds) =>
          eds.map((e) => (e.id === selectedEdge.id ? { ...e, data } : e)),
        );
      }
    },
    [selectedEdge, setEdges],
  );

  const edgeTypes = React.useMemo(
    () => ({
      conditional: ConditionalEdge,
    }),
    [],
  );

  const onAutoLayout = React.useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      "TB",
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // 레이아웃 후 자동 fit
    setTimeout(() => {
      (rfRef.current as any)?.fitView({ padding: 0.2 });
    }, 0);
  }, [nodes, edges, setNodes, setEdges]);

  const handleSave = React.useCallback(
    (desc: string) => {
      const workflow = buildWorkflow();
      const workflowWithUrl = {
        ...workflow,
        targetUrl: targetUrl || undefined,
      } as FormWorkflow;

      onSave({
        workflowId,
        productId,
        description: desc,
        meta: workflowWithUrl,
        type,
      });
      setDescription(desc);
    },
    [workflowId, productId, buildWorkflow, onSave, targetUrl, type],
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderBottom: "1px solid #eee",
        }}
      >
        <WorkflowBuilderHeader
          targetUrl={targetUrl}
          setTargetUrl={setTargetUrl}
          runWorkflow={run}
          isRunning={isRunning}
          onAutoLayout={onAutoLayout}
          onSaveClick={() => setSaveDialogOpen(true)}
          onVariablesClick={() => setVariablesDialogOpen(true)}
          type={type}
          onApiTypeChange={setApiType}
          productId={productId}
          onProductIdChange={setProductId}
          products={products}
        />

        <PaletteSheet
          paletteOpen={paletteOpen}
          setPaletteOpen={setPaletteOpen}
          addNode={addNode}
          blocks={Object.entries(AllBlockSchemas).map(([blockName, schema]) => {
            const info = blockLabels[blockName] || {
              title: blockName,
              description: "",
            };

            // 각 블록의 기본 데이터 생성
            const defaultBlock: any = {
              name: blockName,
              selector: "#selector",
              findBy: "cssSelector" as const,
              option: {},
            };

            // 블록별 특수 필드 추가
            if (blockName === "data-extract") {
              defaultBlock.code = "";
              delete defaultBlock.selector;
              delete defaultBlock.findBy;
              delete defaultBlock.option;
            } else if (blockName === "attribute-value") {
              defaultBlock.attributeName = "href";
            } else if (blockName === "set-value-form") {
              defaultBlock.setValue = "";
              defaultBlock.type = "text-field";
            } else if (
              blockName === "get-value-form" ||
              blockName === "clear-value-form"
            ) {
              defaultBlock.type = "text-field";
            }

            return {
              title: info.title,
              description: info.description,
              type: blockName,
              data: {
                title: info.title,
                block: defaultBlock as Block,
                schema,
              },
            };
          })}
        />
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          gap: "8px",
          height: "100%",
        }}
      >
        {/* 왼쪽: ReactFlow */}
        <div style={{ flex: 1, position: "relative" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeDoubleClick={onEdgeDoubleClick}
            nodeTypes={workflowNodeTypes}
            edgeTypes={edgeTypes}
            onInit={(inst) => {
              rfRef.current = inst;
            }}
            fitView
          >
            <Background />
            <Controls />

            <EdgeConfigDialog
              open={edgeDialogOpen}
              onOpenChange={setEdgeDialogOpen}
              edgeData={selectedEdge?.data}
              onSave={handleEdgeSave}
              targetNodeId={selectedEdge?.target || ""}
            />

            <SaveDialog
              open={saveDialogOpen}
              onOpenChange={setSaveDialogOpen}
              onSave={handleSave}
              initialDescription={description}
            />

            <VariablesDialog
              open={variablesDialogOpen}
              onOpenChange={setVariablesDialogOpen}
              variables={variables}
              onVariablesChange={setVariables}
            />
          </ReactFlow>
          {result && (
            <>
              {console.log(result)}
              {type === "WORKSPACE" && <WorkspaceResultPanel result={result} />}
              {type === "MEMBERS" && <MembersResultPanel result={result} />}
              {type === "PLAN" && <PlanCycleResultPanel result={result} />}
              {type === "BILLING" && <BillingHistoryResultPanel result={result} />}
              {(type === "WORKFLOW" || !type) && <ResultPanel result={result} />}
            </>
          )}
        </div>

        {/* 오른쪽: Variables Preview */}
        <div style={{ width: "300px", overflow: "auto" }}>
          <VariablesPreviewPanel variables={variables} />
        </div>
      </div>
    </div>
  );
}
