import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { EdgFieldContentBox } from "./EdgFieldContentBox";
import { Input } from "~/components/ui/input";
import { usePreviousNodes } from "~/hooks/use-previous-nodes";

interface SingleRegexProps {
  targetNodeId: string;
  selectedNodeId: string;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string>>;
  regexResultPath: string;
  setRegexResultPath: (val: string) => void;
  regexPattern: string;
  setRegexPattern: (val: string) => void;
}

export const SingleRegex = (props: SingleRegexProps) => {
  const { targetNodeId, selectedNodeId, setSelectedNodeId } = props;
  const { regexResultPath, setRegexResultPath } = props;
  const { regexPattern, setRegexPattern } = props;

  const { previousNodes, getNodeDisplayName } = usePreviousNodes(targetNodeId);

  return (
    <>
      <EdgFieldContentBox label="비교할 노드">
        <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
          <SelectTrigger>
            <SelectValue placeholder="노드 선택" />
          </SelectTrigger>
          <SelectContent>
            {previousNodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {getNodeDisplayName(node)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EdgFieldContentBox>

      <EdgFieldContentBox
        label="결과 경로"
        helperText={`최종 경로: $.steps.${selectedNodeId}.${regexResultPath}`}
      >
        <Input
          placeholder="result.data"
          value={regexResultPath}
          onChange={(e) => setRegexResultPath(e.target.value)}
        />
      </EdgFieldContentBox>

      <EdgFieldContentBox label="정규식 패턴">
        <Input
          placeholder="^OK$"
          value={regexPattern}
          onChange={(e) => setRegexPattern(e.target.value)}
        />
      </EdgFieldContentBox>
    </>
  );
};
