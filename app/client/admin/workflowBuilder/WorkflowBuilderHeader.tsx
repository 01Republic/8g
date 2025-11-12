import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
interface WorkflowBuilderHeaderProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  runWorkflow: () => void;
  isRunning: boolean;
  onSaveClick: () => void;
  onParametersClick: () => void;
  onExportClick: () => void;
  onImportClick: () => void;
}

export const WorkflowBuilderHeader = ({
  targetUrl,
  setTargetUrl,
  runWorkflow,
  isRunning,
  onSaveClick,
  onParametersClick,
  onExportClick,
  onImportClick,
}: WorkflowBuilderHeaderProps) => {
  return (
    <>
      <Input
        placeholder="Target URL (기본: 현재 탭)"
        value={targetUrl}
        onChange={(e) => setTargetUrl(e.target.value)}
        style={{ maxWidth: 480 }}
      />
      <Button onClick={runWorkflow} disabled={isRunning}>
        {isRunning ? "Running…" : "Run Workflow"}
      </Button>
      <Button variant="outline" onClick={onExportClick}>
        Export JSON
      </Button>
      <Button variant="outline" onClick={onImportClick}>
        Import JSON
      </Button>
      <Button variant="outline" onClick={onSaveClick}>
        저장
      </Button>
      <div style={{ marginLeft: "auto" }} />
    </>
  );
};
