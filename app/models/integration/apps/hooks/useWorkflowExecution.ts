import { useEffect, useMemo, useState } from 'react'
import { EightGClient, type Workflow } from '8g-extension'
import type { FormWorkflow } from '../IntegrationAppFormMetadata'
import { getAllSectionResults } from './sectionResults'

function resolveTemplateString(template?: string): string | undefined {
  if (!template || typeof template !== 'string') return template
  const all = getAllSectionResults()
  return template.replace(/\{\{\$\.([a-zA-Z0-9_-]+)\.result\}\}/g, (_m, sectionId) => {
    const v = all?.[sectionId]?.result
    return (v ?? '').toString()
  })
}

export function useWorkflowExecution(workflow: FormWorkflow) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [raw, setRaw] = useState<any>(null)
  const [parsed, setParsed] = useState<any>(null)

  const evaluatedUrl = useMemo(() => {
    const rawUrl = typeof (workflow as any)?.targetUrl === 'function' ? (workflow as any).targetUrl() : (workflow as any)?.targetUrl
    return resolveTemplateString(rawUrl) || location.href
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow, JSON.stringify(getAllSectionResults())])

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        setLoading(true)
        setError(null)
        const client = new EightGClient()
        const finalUrl = evaluatedUrl
        const result = await client.collectWorkflow({
          targetUrl: finalUrl,
          workflow: {
            version: '1.0',
            start: workflow.start,
            steps: workflow.steps,
          },
          closeTabAfterCollection: true,
          activateTab: false,
        })
        if (cancelled) return
        setRaw(result)
        if (workflow?.parser) {
          try {
            const mapped = workflow.parser(result)
            const stabilized = Array.isArray(mapped)
              ? [...mapped]
              : mapped
            setParsed(stabilized)
          } catch (e: any) {
            setError(e?.message || 'Parser error')
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Workflow execution failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [workflow, evaluatedUrl])

  return { loading, error, raw, parsed }
}


