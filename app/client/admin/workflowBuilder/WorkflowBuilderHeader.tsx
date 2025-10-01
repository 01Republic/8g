import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface WorkflowBuilderHeaderProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  runWorkflow: () => void;
  isRunning: boolean;
  onAutoLayout?: () => void;
  onSaveClick: () => void;
  onParserClick: () => void;
  onVariablesClick: () => void;
}

export const WorkflowBuilderHeader = ({
  targetUrl,
  setTargetUrl,
  runWorkflow,
  isRunning,
  onAutoLayout,
  onSaveClick,
  onParserClick,
  onVariablesClick,
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
      <Button variant="outline" onClick={onVariablesClick}>
        Variables
      </Button>
      <Button variant="outline" onClick={onParserClick}>
        Parser
      </Button>
      <Button variant="outline" onClick={onSaveClick}>
        저장
      </Button>
      {onAutoLayout && (
        <Button variant="outline" onClick={onAutoLayout}>
          정렬
        </Button>
      )}
      <div style={{ marginLeft: "auto" }} />
    </>
  );
};
