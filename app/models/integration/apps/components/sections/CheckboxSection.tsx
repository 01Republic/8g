import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { CenteredSection } from '~/components/ui/centered-section'
import { LoadingCard } from '~/components/ui/loading-card'
import { LoaderCircleIcon } from 'lucide-react'
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution'
import { setSectionResult } from '../../hooks/sectionResults'

interface CheckboxSectionProps {
  title: string
  workflow: any
  loadingMessage: string
  errorMessage: string
  successMessage: string
  targetUrl?: string
  onPrevious: () => void
  onNext: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export function CheckboxSection({ 
  title, 
  workflow, 
  loadingMessage, 
  errorMessage, 
  successMessage, 
  onPrevious, 
  onNext,
  hasPrevious,
  hasNext,
}: CheckboxSectionProps) {
  const { loading, error, parsed, run } = useWorkflowExecution(workflow)

  useEffect(() => {
    if (parsed === true) {
      setSectionResult('checkbox', { result: true })
    }
  }, [parsed])

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <CenteredSection>
        {loading && (
          <LoadingCard icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} message={loadingMessage} />
        )}
        {!loading && error && (
          <LoadingCard icon={<span className="text-lg">❌</span>} message={error} />
        )}
        {!loading && !error && parsed === false && (
          <LoadingCard icon={<span className="text-lg">❌</span>} message={errorMessage} />
        )}
        {!loading && !error && parsed === true && (
          <LoadingCard icon={<span className="text-lg">✅</span>} message={successMessage} />
        )}
      </CenteredSection>

      <Button onClick={() => run()} disabled={loading} variant="outline" className="px-6 py-2">권한 확인</Button>
      
      <div className="flex justify-between">
        <div>
          {hasPrevious && (
            <Button onClick={onPrevious} variant="outline" className="px-6 py-2">이전</Button>
          )}
        </div>
        <div>
          {hasNext && (
            <div className="flex items-center gap-2">
              <Button onClick={onNext} disabled={parsed !== true} className="px-8 py-2">다음</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



