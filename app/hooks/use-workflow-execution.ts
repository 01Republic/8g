import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormWorkflow } from "~/models/integration/types";
import { getAllSectionResults } from "../models/integration/SectionResultManager";
import { runWorkflow } from "../models/integration/WorkflowRunner";

/*
이 workflow execution은 8g-extension을 사용하여 워크플로우를 실행하고 결과를 반환합니다.
여기서 resolvedUrl은 워크플로우에 전달되는 url입니다.
워크플로우에 전달되는 url은 템플릿 문자열을 포함할 수 있습니다.
템플릿 문자열은 워크플로우에 전달되는 url에 포함된 템플릿 문자열을 찾아서 대체합니다.
예를 들어 워크플로우에 전달되는 url이 https://www.google.com/search?q={{$.selectBoxSection.result}}이고,
selectBoxSection의 result가 "apple"이라면, 워크플로우에 전달되는 url은 https://www.google.com/search?q=apple이 됩니다.
이때 워크플로우에 전달되는 url은 템플릿 문자열을 포함할 수 있습니다.
*/

function resolveTemplateString(template?: string): string | undefined {
  if (!template || typeof template !== "string") return template;

  const all = getAllSectionResults();
  return template.replace(
    /\{\{\$\.([a-zA-Z0-9_-]+)\.result\}\}/g,
    (_m, sectionId) => {
      const v = all?.[sectionId]?.result;
      return (v ?? "").toString();
    },
  );
}

export function useWorkflowExecution(workflow: FormWorkflow) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<any>(null);
  const [parsed, setParsed] = useState<any>(null);

  const evaluatedUrl = useMemo(() => {
    const rawUrl =
      typeof (workflow as any)?.targetUrl === "function"
        ? (workflow as any).targetUrl()
        : (workflow as any)?.targetUrl;
    return resolveTemplateString(rawUrl) || location.href;
  }, [workflow, JSON.stringify(getAllSectionResults())]);

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, [workflow, evaluatedUrl]);

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { result, parsed } = await runWorkflow({ evaluatedUrl, workflow });
      if (cancelledRef.current) return;
      setRaw(result);
      if (parsed !== undefined) setParsed(parsed);
    } catch (e: any) {
      if (!cancelledRef.current)
        setError(e?.message || "Workflow execution failed");
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [evaluatedUrl, workflow]);

  return { loading, error, raw, parsed, run };
}
