import type { FormWorkflow } from "../integration/types";

/**
 * Workflow의 변수 치환
 * ${vars.변수명} 패턴을 실제 값으로 치환
 */
export function resolveWorkflowVariables(
  workflow: FormWorkflow,
  injectedVars?: Record<string, any>
): FormWorkflow {
  // 최종 변수: workflow 기본값 + 주입된 값 (주입된 값이 우선)
  const finalVars = {
    ...workflow.variables,
    ...injectedVars,
  };

  console.log('🔧 Resolving variables:', finalVars);

  // Workflow 전체를 JSON 문자열로 변환
  let workflowJson = JSON.stringify(workflow);

  // ${vars.변수명} 패턴 치환
  Object.entries(finalVars).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{vars\\.${key}\\}`, 'g');
    const replacement = typeof value === 'string' ? value : JSON.stringify(value);
    workflowJson = workflowJson.replace(regex, replacement);
  });

  console.log('✅ Variables resolved');
  return JSON.parse(workflowJson);
}
