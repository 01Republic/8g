import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { CenteredSection } from '~/components/ui/centered-section'
import { LoadingCard } from '~/components/ui/loading-card'
import { LoaderCircleIcon } from 'lucide-react'
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution'

interface CheckboxStepProps {
  title: string
  workflow: any
  targetUrl?: string
  onPrevious: () => void
  onNext: () => void
  ctx?: any
}

export function CheckboxStep({ title, workflow, targetUrl, onPrevious, onNext, ctx }: CheckboxStepProps) {
  const resolvedUrl = targetUrl ?? (typeof workflow?.targetUrl === 'function' ? workflow.targetUrl(ctx) : workflow?.targetUrl)
  const { loading, error, parsed } = useWorkflowExecution(workflow, resolvedUrl)

  useEffect(() => {
    if (parsed === true) {
      const t = window.setTimeout(() => onNext(), 600)
      return () => window.clearTimeout(t)
    }
  }, [parsed, onNext])

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <CenteredSection>
        {loading && (
          <LoadingCard icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} message="권한 확인 중..." />
        )}
        {!loading && error && (
          <LoadingCard icon={<span className="text-lg">❌</span>} message={error} />
        )}
        {!loading && !error && parsed === false && (
          <LoadingCard icon={<span className="text-lg">❌</span>} message="권한 없음: 워크스페이스 관리자만 접근할 수 있습니다." />
        )}
        {!loading && !error && parsed === true && (
          <LoadingCard icon={<span className="text-lg">✅</span>} message="관리자 권한 확인됨" />
        )}
      </CenteredSection>
      {parsed === false && (
        <div className="flex justify-end">
          <Button onClick={onPrevious} variant="outline" className="px-6 py-2">워크스페이스 다시 선택</Button>
        </div>
      )}
    </div>
  )
}


