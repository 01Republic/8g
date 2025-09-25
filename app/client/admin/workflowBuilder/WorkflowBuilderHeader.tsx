import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const WorkflowBuilderHeader = ({
  targetUrl,
  setTargetUrl,
  runWorkflow,
  isRunning,
  buildWorkflowJson,
  setResult,
}) => {
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
      <Button variant="outline" onClick={() => setResult(buildWorkflowJson())}>
        Export JSON
      </Button>
      <div style={{ marginLeft: "auto" }} />
    </>
  );
};
