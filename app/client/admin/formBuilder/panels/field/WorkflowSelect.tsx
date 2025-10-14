import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

interface WorkflowSelectProps {
  id: string;
  value?: number; // workflow ID
  onChange: (workflowId: number | undefined) => void;
  workflows: IntegrationAppWorkflowMetadata[];
  label?: string;
}

const WorkflowSelect = ({
  id,
  value,
  onChange,
  workflows,
  label = "워크플로우 선택",
}: WorkflowSelectProps) => {
  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Select
        value={value?.toString() || ""}
        onValueChange={(val) => {
          if (!val) {
            onChange(undefined);
          } else {
            onChange(parseInt(val));
          }
        }}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder="워크플로우를 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {workflows.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              저장된 워크플로우가 없습니다
            </div>
          ) : (
            workflows.map((workflow) => (
              <SelectItem key={workflow.id} value={workflow.id.toString()}>
                {workflow.description}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkflowSelect;
