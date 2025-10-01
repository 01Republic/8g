import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormWorkflow } from "~/models/integration/types";
import { getAllSectionResults } from "../models/integration/SectionResultManager";
import { runWorkflow } from "../models/workflow/WorkflowRunner";
import { ResultParser } from "../models/workflow/ResultParser";

/*
이 workflow execution은 8g-extension을 사용하여 워크플로우를 실행하고 결과를 반환합니다.
여기서 resolvedUrl은 워크플로우에 전달되는 url입니다.
워크플로우에 전달되는 url은 템플릿 문자열을 포함할 수 있습니다.
템플릿 문자열은 워크플로우에 전달되는 url에 포함된 템플릿 문자열을 찾아서 대체합니다.
예를 들어 워크플로우에 전달되는 url이 https://www.google.com/search?q={{$.selectBoxSection.result}}이고,
selectBoxSection의 result가 "apple"이라면, 워크플로우에 전달되는 url은 https://www.google.com/search?q=apple이 됩니다.
이때 워크플로우에 전달되는 url은 템플릿 문자열을 포함할 수 있습니다.
*/

function resolveTemplateString(
  template?: string,
  variables?: Record<string, any>
): string | undefined {
  if (!template || typeof template !== "string") return template;

  let resolved = template;

  // 1. 오래된 {{$.sectionId.result}} 템플릿 치환
  const all = getAllSectionResults();
  resolved = resolved.replace(
    /\{\{\$\.([a-zA-Z0-9_-]+)\.result\}\}/g,
    (_m, sectionId) => {
      const v = all?.[sectionId]?.result;
      return (v ?? "").toString();
    },
  );

  // 2. 새로운 ${vars.변수명} 패턴 치환
  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\\{vars\\.${key}\\}`, 'g');
      const replacement = typeof value === 'string' ? value : JSON.stringify(value);
      resolved = resolved.replace(regex, replacement);
    });
  }

  return resolved;
}

export function useWorkflowExecution(
  workflow: FormWorkflow,
  variables?: Record<string, any>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<any>(null);
  const [parsed, setParsed] = useState<any>(null);

  const evaluatedUrl = useMemo(() => {
    const rawUrl =
      typeof (workflow as any)?.targetUrl === "function"
        ? (workflow as any).targetUrl()
        : (workflow as any)?.targetUrl;
    return resolveTemplateString(rawUrl, variables) || location.href;
  }, [workflow, variables, JSON.stringify(getAllSectionResults())]);

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, [workflow, evaluatedUrl, variables]);

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const workflowResult = await runWorkflow({ 
        evaluatedUrl, 
        workflow,
        variables  // 변수 전달
      });
      
      if (cancelledRef.current) return;
      setRaw(workflowResult.result);
      
      // Parser 적용 (WorkflowBuilder와 동일한 구조로 전달)
      if (workflow.parser?.expression) {
        try {
          const parsed = await ResultParser.parse(
            workflowResult,  // { result: {...} } 형태로 전달
            workflow.parser.expression
          );
          setParsed(parsed);
          
        } catch (parseError: any) {
          console.error('❌ Parse failed:', parseError);
          setParsed(workflowResult.result); // 실패시 원본 반환
        }
      } else {
        setParsed(workflowResult.result);
      }
    } catch (e: any) {
      if (!cancelledRef.current)
        setError(e?.message || "Workflow execution failed");
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [evaluatedUrl, workflow, variables]);

  return { loading, error, raw, parsed, run };
}
