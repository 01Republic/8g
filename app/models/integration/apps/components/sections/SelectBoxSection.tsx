import { useEffect } from 'react'
import { CenteredSection } from '~/components/ui/centered-section'
import { LoadingCard } from '~/components/ui/loading-card'
import { LoaderCircleIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution'

interface SelectBoxSectionProps {
  title: string
  workflow: any
  placeholder?: string
  selectedValue: string
  onSelectedValueChange: (v: string) => void
  onNext: () => void
  onParsed?: (list: any[]) => void
  ctx?: any
  fallbackUrl?: string
}

export function SelectBoxSection({ title, workflow, placeholder, selectedValue, onSelectedValueChange, onNext, onParsed, ctx, fallbackUrl }: SelectBoxSectionProps) {
  const dynamicUrl = typeof workflow?.targetUrl === 'function' ? workflow.targetUrl(ctx) : fallbackUrl
  const { loading, error, parsed } = useWorkflowExecution(workflow, dynamicUrl)

  useEffect(() => {
    if (Array.isArray(parsed) && onParsed) {
      onParsed(parsed)
    }
  }, [parsed, onParsed])

  useEffect(() => {
    if (selectedValue) {
      const t = window.setTimeout(() => onNext(), 600)
      return () => window.clearTimeout(t)
    }
  }, [selectedValue, onNext])

  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <CenteredSection>
        {loading && (
          <LoadingCard message="데이터 수집 중..." icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} />
        )}
        {!loading && error && (
          <LoadingCard icon={<span className="text-lg">❌</span>} message={error} />
        )}
      </CenteredSection>
      {!loading && Array.isArray(parsed) && parsed.length > 0 && (
        <div className="space-y-4">
          <Select value={selectedValue} onValueChange={onSelectedValueChange}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder={placeholder || '항목을 선택하세요'} />
            </SelectTrigger>
            <SelectContent>
              {parsed.map((item: any, index: number) => {
                const value = index.toString()
                const label = (item.label ?? item.elementText ?? item.text ?? JSON.stringify(item)) as string
                return (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}



