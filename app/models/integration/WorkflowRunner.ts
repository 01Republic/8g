import { EightGClient } from "8g-extension";
import type { FormWorkflow } from "~/models/integration/types";

export interface RunWorkflowParams {
  evaluatedUrl: string;
  workflow: FormWorkflow;
}

export interface RunWorkflowResult<TParsed = any> {
  result: any;
  parsed?: TParsed;
}

export async function runWorkflow(
  params: RunWorkflowParams,
): Promise<RunWorkflowResult> {
  const { evaluatedUrl, workflow } = params;
  const client = new EightGClient();

  const result = await client.collectWorkflow({
    targetUrl: evaluatedUrl,
    workflow: {
      version: "1.0",
      start: workflow.start,
      steps: workflow.steps,
    },
    closeTabAfterCollection: true,
    activateTab: false,
  });

  let parsed: any | undefined;
  if (workflow?.parser) {
    const mapped = workflow.parser(result);
    parsed = Array.isArray(mapped) ? [...mapped] : mapped;
  }

  return { result, parsed };
}
