import { useState, useEffect } from "react";
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
import type { SwitchEdgeData } from "~/models/workflow/types";
import { EdgFieldContentBox } from "./EdgFieldContentBox";
import type {
  ConditionMode,
  MultipleConditionType,
  SingleConditionType,
  SubCondition,
} from "./types";
import { SingleEquals } from "./SingleEquals";
import { SingleExists } from "./SingleExists";
import { SingleContains } from "./SingleContains";
import { Multiple } from "./Multiple";
import { SingleRegex } from "./SingleRegex";
import { parseEdgeData, buildEdgeData } from "./edgeDataConverter";

interface EdgeConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edgeData?: SwitchEdgeData;
  onSave: (data: SwitchEdgeData) => void;
  targetNodeId: string;
}

export function EdgeConfigDialog({
  open,
  onOpenChange,
  edgeData,
  onSave,
  targetNodeId,
}: EdgeConfigDialogProps) {
  // 조건 모드: 단일 vs 복합
  const [conditionMode, setConditionMode] = useState<ConditionMode>("single");

  // 단일 조건 타입
  const [singleConditionType, setSingleConditionType] =
    useState<SingleConditionType>("default");

  // 복합 조건 타입 (AND/OR)
  const [multipleConditionType, setMultipleConditionType] =
    useState<MultipleConditionType>("and");

  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [resultPath, setResultPath] = useState("result.data");

  // equals 조건용
  const [rightValue, setRightValue] = useState("");

  // exists 조건용 - 이제 노드 선택과 경로 조합으로 처리
  const [existsResultPath, setExistsResultPath] = useState("result");

  // expr 조건용
  const [exprValue, setExprValue] = useState("");

  // regex 조건용
  const [regexResultPath, setRegexResultPath] = useState("result.data");
  const [regexPattern, setRegexPattern] = useState("");

  // contains 조건용
  const [containsResultPath, setContainsResultPath] = useState("result.data");
  const [containsSearch, setContainsSearch] = useState("");

  const [subConditions, setSubConditions] = useState<SubCondition[]>([]);

  // edgeData가 변경되거나 dialog가 열릴 때 state 초기화
  useEffect(() => {
    if (!open) return;

    // edgeData를 파싱해서 폼 상태로 변환
    const formState = parseEdgeData(edgeData);

    setConditionMode(formState.conditionMode);
    setSingleConditionType(formState.singleConditionType);
    setMultipleConditionType(formState.multipleConditionType);
    setSelectedNodeId(formState.selectedNodeId);
    setResultPath(formState.resultPath);
    setRightValue(formState.rightValue);
    setExistsResultPath(formState.existsResultPath);
    setExprValue(formState.exprValue);
    setRegexResultPath(formState.regexResultPath);
    setRegexPattern(formState.regexPattern);
    setContainsResultPath(formState.containsResultPath);
    setContainsSearch(formState.containsSearch);
    setSubConditions(formState.subConditions);
  }, [open, edgeData]);

  const handleSave = () => {
    // 현재 폼 상태를 SwitchEdgeData로 직렬화
    const newData = buildEdgeData({
      conditionMode,
      singleConditionType,
      multipleConditionType,
      selectedNodeId,
      resultPath,
      rightValue,
      existsResultPath,
      exprValue,
      regexResultPath,
      regexPattern,
      containsResultPath,
      containsSearch,
      subConditions,
    });

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
              targetNodeId={targetNodeId}
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
              targetNodeId={targetNodeId}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              existsResultPath={existsResultPath}
              setExistsResultPath={setExistsResultPath}
            />
          )}

          {conditionMode === "single" && singleConditionType === "contains" && (
            <SingleContains
              targetNodeId={targetNodeId}
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
              targetNodeId={targetNodeId}
              multipleConditionType={multipleConditionType}
              subConditions={subConditions}
              setSubConditions={setSubConditions}
            />
          )}

          {conditionMode === "single" && singleConditionType === "regex" && (
            <SingleRegex
              targetNodeId={targetNodeId}
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
