import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

interface SelectBoxSectionConfigPanelProps {
  sectionId: string
  sectionIndex: number
  title: string
  placeholder: string
  targetUrl: string
  uiType: string
  index: number
  withMeta: (updater: (draft: any) => void) => void
}

const SelectBoxSectionConfigPanel = ({ sectionId, sectionIndex, title, placeholder, targetUrl, uiType, index, withMeta }: SelectBoxSectionConfigPanelProps) => {
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
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`title-${sectionId}`}>제목</Label>
          <Input
            id={`title-${sectionId}`}
            value={title || ''}
            onChange={(e) => withMeta((draft) => { (draft.sections[index].uiSchema as any).title = e.target.value })}
            placeholder="섹션 제목"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`placeholder-${sectionId}`}>플레이스홀더</Label>
          <Input
            id={`placeholder-${sectionId}`}
            value={placeholder || ''}
            onChange={(e) => withMeta((draft) => { (draft.sections[index].uiSchema as any).placeholder = e.target.value })}
            placeholder="예: 워크스페이스를 선택하세요"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`target-${sectionId}`}>워크플로 대상 URL</Label>
          <Input
            id={`target-${sectionId}`}
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
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
  )
}

export default SelectBoxSectionConfigPanel