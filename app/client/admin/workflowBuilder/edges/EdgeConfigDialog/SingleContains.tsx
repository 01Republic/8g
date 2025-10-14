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

interface SingleContainsProps {
  targetNodeId: string;
  selectedNodeId: string;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string>>;
  containsResultPath: string;
  setContainsResultPath: (value: React.SetStateAction<string>) => void;
  containsSearch: string;
  setContainsSearch: (value: React.SetStateAction<string>) => void;
}

export const SingleContains = (props: SingleContainsProps) => {
  const { targetNodeId, selectedNodeId, setSelectedNodeId } = props;
  const { containsResultPath, setContainsResultPath } = props;
  const { containsSearch, setContainsSearch } = props;

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
        helperText={`최종 경로: $.steps.${selectedNodeId}.${containsResultPath}`}
      >
        <Input
          placeholder="result.data"
          value={containsResultPath}
          onChange={(e) => setContainsResultPath(e.target.value)}
        />
      </EdgFieldContentBox>

      <EdgFieldContentBox label="검색 문자열">
        <Input
          placeholder="검색할 문자열"
          value={containsSearch}
          onChange={(e) => setContainsSearch(e.target.value)}
        />
      </EdgFieldContentBox>
    </>
  );
};
