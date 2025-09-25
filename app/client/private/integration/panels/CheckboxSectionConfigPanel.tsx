import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

interface CheckboxSectionConfigPanelProps {
  sectionId: string
  sectionIndex: number
  placeholder: string
  loadingMessage: string
  errorMessage: string
  successMessage: string
  targetUrl: string
  uiType: string
  index: number
  withMeta: (updater: (draft: any) => void) => void
}

const CheckboxSectionConfigPanel = ({ 
  sectionId, 
  sectionIndex, 
  placeholder,
  loadingMessage, 
  errorMessage, 
  successMessage, 
  targetUrl, 
  uiType, 
  index, withMeta }: CheckboxSectionConfigPanelProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="item">
      <AccordionItem value="item">
      <AccordionTrigger className="px-0">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 select-none">
              <Label className="text-sm">섹션 {sectionIndex}</Label>
              <span className="text-xs text-muted-foreground">{uiType}</span>
            </div>
        </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <Label htmlFor={`cb-placeholder-${sectionId}`}>플레이스홀더</Label>
            <Input
              id={`cb-placeholder-${sectionId}`}
              value={placeholder || ''}
              onChange={(e) => withMeta((draft) => { (draft.sections[index].uiSchema as any).placeholder = e.target.value })}
              placeholder="예: 체크박스"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`cb-loading-${sectionId}`}>로딩 메시지</Label>
            <Input
              id={`cb-loading-${sectionId}`}
              value={loadingMessage || ''}
              onChange={(e) => withMeta((draft) => { (draft.sections[index].uiSchema as any).loadingMessage = e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`cb-error-${sectionId}`}>에러 메시지</Label>
            <Textarea
              id={`cb-error-${sectionId}`}
              value={errorMessage || ''}
              onChange={(e) => withMeta((draft) => { (draft.sections[index].uiSchema as any).errorMessage = e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`cb-success-${sectionId}`}>성공 메시지</Label>
            <Textarea
              id={`cb-success-${sectionId}`}
              value={successMessage || ''}
              onChange={(e) => withMeta((draft) => { (draft.sections[index].uiSchema as any).successMessage = e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`cb-target-${sectionId}`}>워크플로 대상 URL</Label>
            <Input
              id={`cb-target-${sectionId}`}
              value={targetUrl || ''}
              onChange={(e) => withMeta((draft) => { ((draft.sections[index].uiSchema as any).workflow ||= {}).targetUrl = e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                withMeta((draft) => {
                  draft.sections.splice(index, 1)
                })
              }}
            >삭제</Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default CheckboxSectionConfigPanel