import { EightGClient } from "scordi-extension";
import type { FormWorkflow } from "~/models/integration/types";
import type { WorkflowType } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

export interface RunWorkflowParams {
  evaluatedUrl: string;
  workflow: FormWorkflow;
  closeTabAfterCollection?: boolean;
  activateTab?: boolean;
  variables?: Record<string, any>;
  type?: WorkflowType; // 어떤 API를 호출할지 지정
}

export interface RunWorkflowResult {
  result: any;
}

export async function runWorkflow(
  params: RunWorkflowParams,
): Promise<RunWorkflowResult> {
  const {
    evaluatedUrl,
    workflow,
    closeTabAfterCollection,
    activateTab,
    variables,
    type = 'WORKFLOW', // 기본값은 일반 WORKFLOW
  } = params;
  const client = new EightGClient();

  // vars 필드에 변수 병합 (workflow.vars + 주입된 variables)
  const finalVars = {
    ...workflow.vars,
    ...variables,
  };

  const requestParams = {
    targetUrl: workflow.targetUrl ?? evaluatedUrl,
    workflow: {
      version: "1.0" as const,
      start: workflow.start,
      steps: workflow.steps,
      vars: Object.keys(finalVars).length > 0 ? finalVars : undefined,
    },
    closeTabAfterCollection: true,
    activateTab: activateTab ?? true,
  };

  // 타입에 따라 다른 메서드 호출
  let result: any;
  switch (type) {
    case 'WORKSPACE':
      result = await client.getWorkspaces(requestParams);
      break;
    case 'MEMBERS':
      result = await client.getWorkspaceMembers(requestParams);
      break;
    case 'PLAN':
      result = await client.getWorkspacePlanAndCycle(requestParams);
      break;
    case 'BILLING':
      result = await client.getWorkspaceBillingHistories(requestParams);
      break;
    case 'WORKFLOW':
    default:
      result = await client.collectWorkflow(requestParams);
      break;
  }

  return { result };
}
