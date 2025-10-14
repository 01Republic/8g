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

interface SingleExistsProps {
  targetNodeId: string;
  selectedNodeId: string;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string>>;
  existsResultPath: string;
  setExistsResultPath: (value: React.SetStateAction<string>) => void;
}

export const SingleExists = (props: SingleExistsProps) => {
  const { targetNodeId, selectedNodeId, setSelectedNodeId } = props;
  const { existsResultPath, setExistsResultPath } = props;

  const { previousNodes, getNodeDisplayName } = usePreviousNodes(targetNodeId);

  return (
    <>
      <EdgFieldContentBox label="확인할 노드">
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
        helperText={`최종 경로: $.steps.${selectedNodeId}.${existsResultPath}`}
      >
        <Input
          placeholder="result"
          value={existsResultPath}
          className="w-full flex-1"
          onChange={(e) => setExistsResultPath(e.target.value)}
        />
      </EdgFieldContentBox>
    </>
  );
};
