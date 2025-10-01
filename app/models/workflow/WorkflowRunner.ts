import { EightGClient } from "8g-extension";
import type { FormWorkflow } from "~/models/integration/types";
import { resolveWorkflowVariables } from "./VariableResolver";

export interface RunWorkflowParams {
  evaluatedUrl: string;
  workflow: FormWorkflow;
  closeTabAfterCollection?: boolean;
  activateTab?: boolean;
  variables?: Record<string, any>;
}

export interface RunWorkflowResult {
  result: any;
}

export async function runWorkflow(
  params: RunWorkflowParams,
): Promise<RunWorkflowResult> {
  const { evaluatedUrl, workflow, closeTabAfterCollection, activateTab, variables } = params;
  const client = new EightGClient();

  // 변수 치환
  const resolvedWorkflow = variables 
    ? resolveWorkflowVariables(workflow, variables)
    : workflow;

  const result = await client.collectWorkflow({
    targetUrl: evaluatedUrl,
    workflow: {
      version: "1.0",
      start: resolvedWorkflow.start,
      steps: resolvedWorkflow.steps,
    },
    closeTabAfterCollection: closeTabAfterCollection ?? true,
    activateTab: activateTab ?? false,
  });

  return { result };
}
