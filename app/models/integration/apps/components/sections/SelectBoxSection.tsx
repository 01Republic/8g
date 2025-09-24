import { useEffect } from 'react'
import { CenteredSection } from '~/components/ui/centered-section'
import { LoadingCard } from '~/components/ui/loading-card'
import { LoaderCircleIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution'
import { setSectionList, setSectionResult } from '../../hooks/sectionResults'

interface SelectBoxSectionProps {
  title: string
  workflow: any
  placeholder: string
  selectedValue: string
  onSelectedValueChange: (v: string) => void
  onNext: () => void
  onParsed?: (list: any[]) => void
  onPrevious?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export function SelectBoxSection({ 
  title, 
  workflow, 
  placeholder, 
  selectedValue, 
  onSelectedValueChange, 
  onNext, 
  onParsed, 
  onPrevious, 
  hasPrevious, 
  hasNext 
}: SelectBoxSectionProps) {
  const { loading, error, parsed, run } = useWorkflowExecution(workflow)

  useEffect(() => {
    if (Array.isArray(parsed) && onParsed) {
      onParsed(parsed)
      setSectionList('select-box', parsed)
    }
  }, [parsed, onParsed])

  useEffect(() => {
    if (selectedValue) {
      setSectionResult('select-box', { 
        result: parsed?.[parseInt(selectedValue)]?.elementId || parsed?.[parseInt(selectedValue)]?.elementText || selectedValue, 
        list: parsed 
      })
    }
  }, [selectedValue])

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
      
      <div className="flex justify-end">
        <Button onClick={() => run()} disabled={loading} variant="outline" className="px-6 py-2">데이터 수집</Button>
      </div>

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

      <div className="flex justify-between pt-2">
        <div>
          {hasPrevious && (
            <Button onClick={onPrevious} variant="outline" className="px-6 py-2">이전</Button>
              )}
            </div>
            <div>
              {hasNext && (
                <Button onClick={onNext} disabled={!selectedValue} className="px-8 py-2">다음</Button>
              )}
            </div>
          </div>
    </div>
  )
}



