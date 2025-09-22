import { useEffect, useState } from 'react'
import { EightGClient } from '8g-extension'

export function useWorkflowExecution(workflow: any, targetUrl?: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [raw, setRaw] = useState<any>(null)
  const [parsed, setParsed] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        setLoading(true)
        setError(null)
        const client = new EightGClient()
        const finalUrl = targetUrl || (typeof workflow?.targetUrl === 'string' ? workflow.targetUrl : undefined) || location.href
        const workflowPayload = {
          version: workflow?.version,
          start: workflow?.start,
          steps: workflow?.steps,
        }
        const result = await client.collectWorkflow({
          targetUrl: finalUrl,
          workflow: workflowPayload,
          closeTabAfterCollection: true,
          activateTab: false,
        })
        if (cancelled) return
        setRaw(result)
        if (workflow?.parser) {
          try {
            const mapped = workflow.parser(result)
            setParsed(mapped)
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
  }, [workflow, targetUrl])

  return { loading, error, raw, parsed }
}


