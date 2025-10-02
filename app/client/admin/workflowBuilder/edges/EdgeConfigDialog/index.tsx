import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { SwitchEdgeData, WhenCondition } from "~/models/workflow/types";
import { EdgFieldContentBox } from "./EdgFieldContentBox";
import type {
  ConditionMode,
  MultipleConditionType,
  SingleConditionType,
  SubCondition,
  SubConditionType,
  WorkflowNode,
} from "./types";
import { SingleEquals } from "./SingleEquals";
import { SingleExists } from "./SingleExists";
import { SingleContains } from "./SingleContains";
import { Multiple } from "./Multiple";
import { SingleRegex } from "./SingleRegex";

interface EdgeConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edgeData?: SwitchEdgeData;
  onSave: (data: SwitchEdgeData) => void;
  nodes?: WorkflowNode[];
}

export function EdgeConfigDialog({
  open,
  onOpenChange,
  edgeData,
  onSave,
  nodes = [],
}: EdgeConfigDialogProps) {
  // 조건 모드: 단일 vs 복합
  const [conditionMode, setConditionMode] = useState<ConditionMode>(
    edgeData?.when?.and || edgeData?.when?.or ? "multiple" : "single"
  );

  // 단일 조건 타입
  const [singleConditionType, setSingleConditionType] =
    useState<SingleConditionType>(
      edgeData?.isDefault
        ? "default"
        : edgeData?.when?.equals
          ? "equals"
          : edgeData?.when?.exists
            ? "exists"
            : edgeData?.when?.expr
              ? "expr"
              : edgeData?.when?.regex
                ? "regex"
                : edgeData?.when?.contains
                  ? "contains"
                  : "default"
    );

  // 복합 조건 타입 (AND/OR)
  const [multipleConditionType, setMultipleConditionType] =
    useState<MultipleConditionType>(edgeData?.when?.and ? "and" : "or");

  // 노드 선택용 (equals, exists, regex에서 사용)
  const extractNodeIdFromPath = (path: string) => {
    const match = path.match(/\$\.steps\.([^.]+)/);
    return match ? match[1] : nodes[0]?.id || "";
  };

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    extractNodeIdFromPath(
      edgeData?.when?.equals?.left ||
        edgeData?.when?.exists ||
        edgeData?.when?.regex?.value ||
        ""
    )
  );

  const [resultPath, setResultPath] = useState("result.data");

  // equals 조건용
  const [rightValue, setRightValue] = useState(
    edgeData?.when?.equals?.right || ""
  );

  // exists 조건용 - 이제 노드 선택과 경로 조합으로 처리
  const [existsResultPath, setExistsResultPath] = useState("result");

  // expr 조건용
  const [exprValue, setExprValue] = useState(edgeData?.when?.expr || "");

  // regex 조건용
  const [regexResultPath, setRegexResultPath] = useState("result.data");
  const [regexPattern, setRegexPattern] = useState(
    edgeData?.when?.regex?.pattern || ""
  );

  // contains 조건용
  const [containsResultPath, setContainsResultPath] = useState("result.data");
  const [containsSearch, setContainsSearch] = useState(
    edgeData?.when?.contains?.search || ""
  );

  const initializeSubConditions = (): SubCondition[] => {
    const conditions = edgeData?.when?.and || edgeData?.when?.or || [];
    if (conditions.length === 0) return [];

    return conditions.map((cond: any, idx: number) => {
      const id = `sub-${Date.now()}-${idx}`;
      if (cond.equals) {
        const match = cond.equals.left?.match(/\$\.steps\.([^.]+)\.(.+)/);
        return {
          id,
          type: "equals" as SubConditionType,
          nodeId: match?.[1] || nodes[0]?.id || "",
          path: match?.[2] || "result.data",
          value: cond.equals.right || "",
        };
      } else if (cond.contains) {
        const match = cond.contains.value?.match(/\$\.steps\.([^.]+)\.(.+)/);
        return {
          id,
          type: "contains" as SubConditionType,
          nodeId: match?.[1] || nodes[0]?.id || "",
          path: match?.[2] || "result.data",
          value: cond.contains.search || "",
        };
      } else if (cond.exists) {
        const match = cond.exists?.match(/\$\.steps\.([^.]+)\.(.+)/);
        return {
          id,
          type: "exists" as SubConditionType,
          nodeId: match?.[1] || nodes[0]?.id || "",
          path: match?.[2] || "result",
        };
      } else if (cond.regex) {
        const match = cond.regex.value?.match(/\$\.steps\.([^.]+)\.(.+)/);
        return {
          id,
          type: "regex" as SubConditionType,
          nodeId: match?.[1] || nodes[0]?.id || "",
          path: match?.[2] || "result.data",
          value: cond.regex.pattern || "",
        };
      }
      return {
        id,
        type: "equals" as SubConditionType,
        nodeId: nodes[0]?.id || "",
        path: "result.data",
        value: "",
      };
    });
  };

  const [subConditions, setSubConditions] = useState<SubCondition[]>(
    initializeSubConditions
  );

  const handleSave = () => {
    let newData: SwitchEdgeData = {};

    if (conditionMode === "single") {
      // 단일 조건 처리
      switch (singleConditionType) {
        case "default":
          newData = {
            isDefault: true,
            conditionLabel: "default",
          };
          break;

        case "equals":
          const leftPath = `$.steps.${selectedNodeId}.${resultPath}`;
          newData = {
            when: {
              equals: { left: leftPath, right: rightValue },
            },
            conditionLabel: `== ${rightValue}`,
            isDefault: false,
          };
          break;

        case "exists":
          const existsPath = `$.steps.${selectedNodeId}.${existsResultPath}`;
          newData = {
            when: {
              exists: existsPath,
            },
            conditionLabel: "exists",
            isDefault: false,
          };
          break;

        case "expr":
          newData = {
            when: {
              expr: exprValue,
            },
            conditionLabel:
              exprValue.length > 15
                ? exprValue.substring(0, 15) + "..."
                : exprValue,
            isDefault: false,
          };
          break;

        case "regex":
          const regexPath = `$.steps.${selectedNodeId}.${regexResultPath}`;
          newData = {
            when: {
              regex: { value: regexPath, pattern: regexPattern },
            },
            conditionLabel: `~= ${regexPattern}`,
            isDefault: false,
          };
          break;

        case "contains":
          const containsPath = `$.steps.${selectedNodeId}.${containsResultPath}`;
          newData = {
            when: {
              contains: { value: containsPath, search: containsSearch },
            },
            conditionLabel: `contains ${containsSearch}`,
            isDefault: false,
          };
          break;

        default:
          break;
      }
    } else {
      // 복합 조건 (AND/OR) 처리
      if (multipleConditionType === "and") {
        const andConditions: WhenCondition[] = subConditions.map((sub) => {
          const fullPath = `$.steps.${sub.nodeId}.${sub.path}`;
          if (sub.type === "equals") {
            return { equals: { left: fullPath, right: sub.value } };
          } else if (sub.type === "contains") {
            return { contains: { value: fullPath, search: sub.value || "" } };
          } else if (sub.type === "exists") {
            return { exists: fullPath };
          } else if (sub.type === "regex") {
            return { regex: { value: fullPath, pattern: sub.value || "" } };
          }
          return { exists: fullPath };
        });
        newData = {
          when: {
            and: andConditions,
          },
          conditionLabel: `AND (${andConditions.length})`,
          isDefault: false,
        };
      } else if (multipleConditionType === "or") {
        const orConditions: WhenCondition[] = subConditions.map((sub) => {
          const fullPath = `$.steps.${sub.nodeId}.${sub.path}`;
          if (sub.type === "equals") {
            return { equals: { left: fullPath, right: sub.value } };
          } else if (sub.type === "contains") {
            return { contains: { value: fullPath, search: sub.value || "" } };
          } else if (sub.type === "exists") {
            return { exists: fullPath };
          } else if (sub.type === "regex") {
            return { regex: { value: fullPath, pattern: sub.value || "" } };
          }
          return { exists: fullPath };
        });
        newData = {
          when: {
            or: orConditions,
          },
          conditionLabel: `OR (${orConditions.length})`,
          isDefault: false,
        };
      }
    }

    onSave(newData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] ">
        <DialogHeader>
          <DialogTitle>Edge 조건 설정</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col w-full gap-4 py-4 ">
          {/* 조건 모드 선택 */}
          <EdgFieldContentBox label="조건 모드">
            <Select
              value={conditionMode}
              onValueChange={(v) => setConditionMode(v as ConditionMode)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">단일 조건</SelectItem>
                <SelectItem value="multiple">복합 조건 (AND/OR)</SelectItem>
              </SelectContent>
            </Select>
          </EdgFieldContentBox>

          {/* 단일 조건 */}
          {conditionMode === "single" && (
            <EdgFieldContentBox label="조건 타입">
              <Select
                value={singleConditionType}
                onValueChange={(v) =>
                  setSingleConditionType(v as SingleConditionType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">조건 없음 (기본)</SelectItem>
                  <SelectItem value="equals">같음 (equals)</SelectItem>
                  <SelectItem value="contains">포함 (contains)</SelectItem>
                  <SelectItem value="exists">존재 여부 (exists)</SelectItem>
                  <SelectItem value="regex">정규식 (regex)</SelectItem>
                  <SelectItem value="expr">표현식 (expr)</SelectItem>
                </SelectContent>
              </Select>
            </EdgFieldContentBox>
          )}

          {/* 복합 조건 (AND/OR) */}
          {conditionMode === "multiple" && (
            <EdgFieldContentBox label="복합 조건 타입">
              <Select
                value={multipleConditionType}
                onValueChange={(v) =>
                  setMultipleConditionType(v as MultipleConditionType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="and">AND (모두 만족)</SelectItem>
                  <SelectItem value="or">OR (하나라도 만족)</SelectItem>
                </SelectContent>
              </Select>
            </EdgFieldContentBox>
          )}

          {/* 단일 조건 상세 설정 */}
          {conditionMode === "single" && singleConditionType === "equals" && (
            <SingleEquals
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              resultPath={resultPath}
              setResultPath={setResultPath}
              rightValue={rightValue}
              setRightValue={setRightValue}
            />
          )}

          {conditionMode === "single" && singleConditionType === "exists" && (
            <SingleExists
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              existsResultPath={existsResultPath}
              setExistsResultPath={setExistsResultPath}
            />
          )}

          {conditionMode === "single" && singleConditionType === "contains" && (
            <SingleContains
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              containsResultPath={containsResultPath}
              setContainsResultPath={setContainsResultPath}
              containsSearch={containsSearch}
              setContainsSearch={setContainsSearch}
            />
          )}

          {conditionMode === "single" && singleConditionType === "expr" && (
            <EdgFieldContentBox label="표현식">
              <Input
                placeholder="$.steps.prev.result.data == 'OK'"
                value={exprValue}
                onChange={(e) => setExprValue(e.target.value)}
              />
            </EdgFieldContentBox>
          )}

          {conditionMode === "multiple" && (
            <Multiple
              nodes={nodes}
              multipleConditionType={multipleConditionType}
              subConditions={subConditions}
              setSubConditions={setSubConditions}
            />
          )}

          {conditionMode === "single" && singleConditionType === "regex" && (
            <SingleRegex
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              regexResultPath={regexResultPath}
              setRegexResultPath={setRegexResultPath}
              regexPattern={regexPattern}
              setRegexPattern={setRegexPattern}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
