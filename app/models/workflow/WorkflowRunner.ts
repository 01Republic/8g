import { EightGClient } from "scordi-extension";
import type { FormWorkflow } from "~/models/integration/types";

export type WorkflowApiType = 'collectWorkflow' | 'getWorkspaces' | 'getWorkspaceMembers' | 'getWorkspacePlanAndCycle' | 'getWorkspaceBillingHistories';

export interface RunWorkflowParams {
  evaluatedUrl: string;
  workflow: FormWorkflow;
  closeTabAfterCollection?: boolean;
  activateTab?: boolean;
  variables?: Record<string, any>;
  apiType?: WorkflowApiType; // 어떤 API를 호출할지 지정
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
    apiType = 'collectWorkflow', // 기본값은 일반 collectWorkflow
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
    closeTabAfterCollection: false,
    activateTab: activateTab ?? true,
  };

  // API 타입에 따라 다른 메서드 호출
  let result: any;
  switch (apiType) {
    case 'getWorkspaces':
      result = await client.getWorkspaces(requestParams);
      break;
    case 'getWorkspaceMembers':
      result = await client.getWorkspaceMembers(requestParams);
      break;
    case 'getWorkspacePlanAndCycle':
      result = await client.getWorkspacePlanAndCycle(requestParams);
      break;
    case 'getWorkspaceBillingHistories':
      result = await client.getWorkspaceBillingHistories(requestParams);
      break;
    case 'collectWorkflow':
    default:
      result = await client.collectWorkflow(requestParams);
      break;
  }

  return { result };
}
