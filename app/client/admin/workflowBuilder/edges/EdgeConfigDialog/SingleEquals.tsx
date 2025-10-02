import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { EdgFieldContentBox } from "./EdgFieldContentBox";
import { Input } from "~/components/ui/input";
import type { WorkflowNode } from "./types";

interface SingleEqualsProps {
  nodes: WorkflowNode[];
  selectedNodeId: string;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string>>;
  resultPath: string;
  setResultPath: (value: React.SetStateAction<string>) => void;
  rightValue: any;
  setRightValue: (value: any) => void;
}

export const SingleEquals = (props: SingleEqualsProps) => {
  const { nodes, selectedNodeId, setSelectedNodeId } = props;
  const { resultPath, setResultPath } = props;
  const { rightValue, setRightValue } = props;
  return (
    <>
      <EdgFieldContentBox label="비교할 노드">
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
      </EdgFieldContentBox>

      <EdgFieldContentBox
        label="결과 경로"
        helperText={`최종 경로: $.steps.${selectedNodeId}.${resultPath}`}
      >
        <Input
          placeholder="result.data"
          value={resultPath}
          onChange={(e) => setResultPath(e.target.value)}
        />
      </EdgFieldContentBox>

      <EdgFieldContentBox label="비교 값">
        <Input
          placeholder="OK"
          value={rightValue}
          onChange={(e) => setRightValue(e.target.value)}
        />
      </EdgFieldContentBox>
    </>
  );
};
