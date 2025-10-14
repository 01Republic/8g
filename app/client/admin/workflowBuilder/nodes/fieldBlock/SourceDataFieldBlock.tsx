import { Label } from "~/components/ui/label";
import { FieldBlockContentBox } from "./FieldBlockContentBox";
import type { ParsedField } from "~/lib/schema-parser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useReactFlow } from "@xyflow/react";
import { blockLabels } from "../index";

interface SourceDataFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
  currentNodeId: string;
}

export const SourceDataFieldBlock = (props: SourceDataFieldBlockProps) => {
  const { field, formData, updateFormField, currentNodeId } = props;
  const { name } = field;
  const { getNodes, getEdges } = useReactFlow();

  // 현재 노드보다 이전에 있는 모든 노드들 찾기 (재귀적으로)
  const getPreviousNodes = () => {
    const allNodes = getNodes();
    const allEdges = getEdges();

    // BFS로 현재 노드 이전의 모든 노드 찾기
    const visited = new Set<string>();
    const queue: string[] = [];

    // 현재 노드로 들어오는 edge들의 source를 큐에 추가
    const incomingEdges = allEdges.filter(
      (edge) => edge.target === currentNodeId,
    );
    incomingEdges.forEach((edge) => {
      if (!visited.has(edge.source)) {
        visited.add(edge.source);
        queue.push(edge.source);
      }
    });

    // BFS로 모든 이전 노드 탐색
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const prevEdges = allEdges.filter((edge) => edge.target === nodeId);

      prevEdges.forEach((edge) => {
        if (!visited.has(edge.source)) {
          visited.add(edge.source);
          queue.push(edge.source);
        }
      });
    }

    // visited에 있는 노드들 반환
    return allNodes.filter((node) => visited.has(node.id));
  };

  const previousNodes = getPreviousNodes();

  // 현재 값에서 노드 ID 추출 (${$.steps.{nodeId}.result.data} 형태)
  const currentValue = formData[name] || "";
  const extractNodeId = (value: string) => {
    const match = value.match(/\$\{?\$\.steps\.([^.}]+)\.result/);
    return match ? match[1] : "";
  };
  const selectedNodeId = extractNodeId(currentValue);

  const handleNodeSelect = (nodeId: string) => {
    if (!nodeId) {
      updateFormField(name, "");
      return;
    }
    // ${$.steps.{nodeId}.result.data} 형태로 설정
    updateFormField(name, `\${steps.${nodeId}.result.data}`);
  };

  return (
    <FieldBlockContentBox key={name} label="소스 데이터">
      <Select value={selectedNodeId} onValueChange={handleNodeSelect}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="이전 노드 선택" />
        </SelectTrigger>
        <SelectContent>
          {previousNodes.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              이전 노드가 없습니다
            </div>
          ) : (
            previousNodes.map((node) => {
              const blockName = (node.data as any)?.block?.name || "";
              const displayName =
                blockName && blockLabels[blockName]
                  ? blockLabels[blockName].title
                  : blockName || node.id;
              return (
                <SelectItem key={node.id} value={node.id}>
                  {node.id} - {displayName}
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
      {selectedNodeId && (
        <div className="text-xs text-gray-500 mt-1 font-mono">
          {currentValue}
        </div>
      )}
    </FieldBlockContentBox>
  );
};
