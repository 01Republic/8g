import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { SwitchEdgeData, WhenCondition } from "~/models/workflow/types";

interface WorkflowNode {
  id: string;
  data?: {
    title?: string;
    block?: {
      name?: string;
    };
  };
}

interface EdgeConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edgeData?: SwitchEdgeData;
  onSave: (data: SwitchEdgeData) => void;
  nodes?: WorkflowNode[];
}

type ConditionMode = "single" | "multiple";
type SingleConditionType = "default" | "equals" | "exists" | "expr" | "regex" | "contains";
type MultipleConditionType = "and" | "or";

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
  const [singleConditionType, setSingleConditionType] = useState<SingleConditionType>(
    edgeData?.isDefault ? "default" : 
    edgeData?.when?.equals ? "equals" :
    edgeData?.when?.exists ? "exists" :
    edgeData?.when?.expr ? "expr" :
    edgeData?.when?.regex ? "regex" :
    edgeData?.when?.contains ? "contains" :
    "default"
  );

  // 복합 조건 타입 (AND/OR)
  const [multipleConditionType, setMultipleConditionType] = useState<MultipleConditionType>(
    edgeData?.when?.and ? "and" : "or"
  );

  // 노드 선택용 (equals, exists, regex에서 사용)
  const extractNodeIdFromPath = (path: string) => {
    const match = path.match(/\$\.steps\.([^.]+)/);
    return match ? match[1] : (nodes[0]?.id || "");
  };

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    extractNodeIdFromPath(edgeData?.when?.equals?.left || edgeData?.when?.exists || edgeData?.when?.regex?.value || "")
  );

  const [resultPath, setResultPath] = useState("result.data");

  // equals 조건용
  const [rightValue, setRightValue] = useState(
    edgeData?.when?.equals?.right || ""
  );

  // exists 조건용 - 이제 노드 선택과 경로 조합으로 처리
  const [existsResultPath, setExistsResultPath] = useState("result");

  // expr 조건용
  const [exprValue, setExprValue] = useState(
    edgeData?.when?.expr || ""
  );

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

  // and/or 조건용 - 동적 UI로 관리
  type SubConditionType = "equals" | "contains" | "exists" | "regex";
  
  interface SubCondition {
    id: string;
    type: SubConditionType;
    nodeId: string;
    path: string;
    value?: string; // equals의 right, contains의 substring, regex의 pattern
  }

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

  const [subConditions, setSubConditions] = useState<SubCondition[]>(initializeSubConditions);

  const addSubCondition = () => {
    setSubConditions([...subConditions, {
      id: `sub-${Date.now()}`,
      type: "equals",
      nodeId: nodes[0]?.id || "",
      path: "result.data",
      value: "",
    }]);
  };

  const removeSubCondition = (id: string) => {
    setSubConditions(subConditions.filter(c => c.id !== id));
  };

  const updateSubCondition = (id: string, field: keyof SubCondition, value: any) => {
    setSubConditions(subConditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

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
          conditionLabel: exprValue.length > 15 ? exprValue.substring(0, 15) + "..." : exprValue,
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
        const andConditions: WhenCondition[] = subConditions.map(sub => {
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
        const orConditions: WhenCondition[] = subConditions.map(sub => {
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edge 조건 설정</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 조건 모드 선택 */}
          <div className="grid gap-2">
            <Label>조건 모드</Label>
            <Select value={conditionMode} onValueChange={(v) => setConditionMode(v as ConditionMode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">단일 조건</SelectItem>
                <SelectItem value="multiple">복합 조건 (AND/OR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 단일 조건 */}
          {conditionMode === "single" && (
            <>
              <div className="grid gap-2">
                <Label>조건 타입</Label>
                <Select value={singleConditionType} onValueChange={(v) => setSingleConditionType(v as SingleConditionType)}>
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
              </div>
            </>
          )}

          {/* 복합 조건 (AND/OR) */}
          {conditionMode === "multiple" && (
            <div className="grid gap-2">
              <Label>복합 조건 타입</Label>
              <Select value={multipleConditionType} onValueChange={(v) => setMultipleConditionType(v as MultipleConditionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="and">AND (모두 만족)</SelectItem>
                  <SelectItem value="or">OR (하나라도 만족)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 단일 조건 상세 설정 */}
          {conditionMode === "single" && singleConditionType === "equals" && (
            <>
              <div className="grid gap-2">
                <Label>비교할 노드</Label>
                <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="노드 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.data?.title || node.data?.block?.name || node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>결과 경로</Label>
                <Input
                  placeholder="result.data"
                  value={resultPath}
                  onChange={(e) => setResultPath(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  최종 경로: $.steps.{selectedNodeId}.{resultPath}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>비교 값</Label>
                <Input
                  placeholder="OK"
                  value={rightValue}
                  onChange={(e) => setRightValue(e.target.value)}
                />
              </div>
            </>
          )}

          {conditionMode === "single" && singleConditionType === "exists" && (
            <>
              <div className="grid gap-2">
                <Label>확인할 노드</Label>
                <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="노드 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.data?.title || node.data?.block?.name || node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>결과 경로</Label>
                <Input
                  placeholder="result"
                  value={existsResultPath}
                  onChange={(e) => setExistsResultPath(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  최종 경로: $.steps.{selectedNodeId}.{existsResultPath}
                </p>
              </div>
            </>
          )}

          {conditionMode === "single" && singleConditionType === "contains" && (
            <>
              <div className="grid gap-2">
                <Label>비교할 노드</Label>
                <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="노드 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.data?.title || node.data?.block?.name || node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>결과 경로</Label>
                <Input
                  placeholder="result.data"
                  value={containsResultPath}
                  onChange={(e) => setContainsResultPath(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  최종 경로: $.steps.{selectedNodeId}.{containsResultPath}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>검색 문자열</Label>
                <Input
                  placeholder="검색할 문자열"
                  value={containsSearch}
                  onChange={(e) => setContainsSearch(e.target.value)}
                />
              </div>
            </>
          )}

          {conditionMode === "single" && singleConditionType === "expr" && (
            <div className="grid gap-2">
              <Label>표현식</Label>
              <Input
                placeholder="$.steps.prev.result.data == 'OK'"
                value={exprValue}
                onChange={(e) => setExprValue(e.target.value)}
              />
            </div>
          )}

          {conditionMode === "multiple" && (
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>
                  {multipleConditionType === "and" ? "AND 조건 (모두 만족)" : "OR 조건 (하나라도 만족)"}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubCondition}
                >
                  + 조건 추가
                </Button>
              </div>
              
              {subConditions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  조건을 추가해주세요
                </p>
              )}

              {subConditions.map((sub, index) => (
                <div key={sub.id} className="grid gap-2 p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">조건 {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubCondition(sub.id)}
                    >
                      삭제
                    </Button>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>조건 타입</Label>
                    <Select 
                      value={sub.type} 
                      onValueChange={(v) => updateSubCondition(sub.id, "type", v as SubConditionType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">같음 (equals)</SelectItem>
                        <SelectItem value="contains">포함 (contains)</SelectItem>
                        <SelectItem value="exists">존재 (exists)</SelectItem>
                        <SelectItem value="regex">정규식 (regex)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>노드</Label>
                    <Select 
                      value={sub.nodeId} 
                      onValueChange={(v) => updateSubCondition(sub.id, "nodeId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.data?.title || node.data?.block?.name || node.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>경로</Label>
                    <Input
                      value={sub.path}
                      onChange={(e) => updateSubCondition(sub.id, "path", e.target.value)}
                      placeholder="result.data"
                    />
                  </div>

                  {(sub.type === "equals" || sub.type === "contains" || sub.type === "regex") && (
                    <div className="grid gap-2">
                      <Label>
                        {sub.type === "equals" ? "비교 값" : 
                         sub.type === "contains" ? "검색 문자열" : 
                         "정규식 패턴"}
                      </Label>
                      <Input
                        value={sub.value || ""}
                        onChange={(e) => updateSubCondition(sub.id, "value", e.target.value)}
                        placeholder={
                          sub.type === "equals" ? "OK" : 
                          sub.type === "contains" ? "검색할 문자열" : 
                          "^OK$"
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {conditionMode === "single" && singleConditionType === "regex" && (
            <>
              <div className="grid gap-2">
                <Label>비교할 노드</Label>
                <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="노드 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.data?.title || node.data?.block?.name || node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>결과 경로</Label>
                <Input
                  placeholder="result.data"
                  value={regexResultPath}
                  onChange={(e) => setRegexResultPath(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  최종 경로: $.steps.{selectedNodeId}.{regexResultPath}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>정규식 패턴</Label>
                <Input
                  placeholder="^OK$"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                />
              </div>
            </>
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
