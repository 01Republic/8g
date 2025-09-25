import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

interface WorkflowFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string | null;
  rows?: number;
}

const WorkflowField = ({
  id,
  value,
  onChange,
  label = "워크플로 JSON",
  placeholder,
  error,
  rows = 10,
}: WorkflowFieldProps) => {
  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={error ? "border-destructive" : ""}
        rows={rows}
      />
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
};

export default WorkflowField;
