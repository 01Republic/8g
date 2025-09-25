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
import { workflowNodeTypes } from "~/models/workflow/components/nodes";
import { getTextNodeTypeKey } from "~/models/workflow/components/nodes";
import type { GetTextBlock, Workflow, WorkflowStep } from "8g-extension";
import { EightGClient } from "8g-extension";
import { PaletteSheet } from "./PaletteSheet";
import { ResultPanel } from "./ResultPanel";
import { WorkflowBuilderHeader } from "./WorkflowBuilderHeader";

export default function WorkflowBuilderPage() {
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = React.useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const [targetUrl, setTargetUrl] = React.useState<string>(
    typeof window !== "undefined" ? window.location.href : "",
  );
  const [isRunning, setIsRunning] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const rfRef = React.useRef<unknown>(null);
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  const buildWorkflowJson = React.useCallback((): Workflow => {
    const nodes = ((rfRef.current as any)?.getNodes?.() ?? []) as any[];
    const outgoing = new Map<string, string[]>();
    const incomingCount = new Map<string, number>();

    nodes.forEach((n) => incomingCount.set(n.id, 0));
    edges.forEach((e: Edge) => {
      const src = e.source;
      const tgt = e.target;
      if (!outgoing.has(src)) outgoing.set(src, []);
      outgoing.get(src)!.push(tgt);
      incomingCount.set(tgt, (incomingCount.get(tgt) ?? 0) + 1);
    });

    const startNode =
      nodes.find((n) => (incomingCount.get(n.id) ?? 0) === 0) ?? nodes[0];
    const steps: WorkflowStep[] = nodes.map((n) => {
      const nexts = outgoing.get(n.id) ?? [];
      const next = nexts[0];
      const block = (n.data as any).block as GetTextBlock;
      const step: WorkflowStep = {
        id: n.id,
        block: {
          ...block,
          option: block.option ?? {},
        },
      };
      if (next) step.next = next;
      return step;
    });

    return {
      version: "1.0",
      start: startNode?.id ?? (nodes[0]?.id || ""),
      steps,
    } as Workflow;
  }, [edges]);

  const runWorkflow = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const client = new EightGClient();
      const workflow = buildWorkflowJson();
      const res = await client.collectWorkflow({
        targetUrl:
          targetUrl ||
          (typeof window !== "undefined" ? window.location.href : ""),
        workflow,
        closeTabAfterCollection: true,
        activateTab: false,
      });
      setResult(res);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setIsRunning(false);
    }
  };

  const addNode = React.useCallback((type: string, data: any) => {
    const inst: any = rfRef.current as any;
    const vp = inst?.getViewport?.();
    const position = vp
      ? { x: -vp.x / vp.zoom + 120, y: -vp.y / vp.zoom + 80 }
      : { x: 120, y: 80 };
    const id = `node_${Date.now()}`;
    const newNode = { id, type, position, data };
    inst?.setNodes?.((nds: any[]) => nds.concat(newNode));
    setPaletteOpen(false);
  }, []);

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
          runWorkflow={runWorkflow}
          isRunning={isRunning}
          buildWorkflowJson={buildWorkflowJson}
          setResult={setResult}
        />

        <PaletteSheet
          paletteOpen={paletteOpen}
          setPaletteOpen={setPaletteOpen}
          addNode={addNode}
          blocks={[
            {
              title: "Get Text",
              description: "CSS/XPath로 요소 텍스트 추출",
              type: getTextNodeTypeKey,
              data: {
                title: "Get Text",
                block: {
                  name: "get-text",
                  selector: "#title",
                  findBy: "cssSelector",
                  option: {},
                  useTextContent: true,
                } as GetTextBlock,
              },
            },
          ]}
        />
      </div>

      <div style={{ position: "relative" }}>
        <ReactFlow
          defaultNodes={[] as any}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={workflowNodeTypes}
          onInit={(inst) => {
            rfRef.current = inst;
          }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        {result && <ResultPanel result={result} />}
      </div>
    </div>
  );
}
