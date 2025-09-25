import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import type { FormWorkflow } from '~/models/integration/types'
import { useWorkflowConfig } from '~/hooks/use-workflow-config'
import WorkflowField from './field/WorkflowField'
import TextField from './field/TextField'

interface SelectBoxSectionConfigPanelProps {
  sectionId: string
  sectionIndex: number
  title: string
  placeholder: string
  workflow?: FormWorkflow
  uiType: string
  index: number
  withMeta: (updater: (draft: any) => void) => void
}

const SelectBoxSectionConfigPanel = ({ sectionId, sectionIndex, title, placeholder, workflow, uiType, index, withMeta }: SelectBoxSectionConfigPanelProps) => {
  const { workflowText, workflowError, handleWorkflowChange } = useWorkflowConfig({
    index,
    withMeta,
    initialWorkflow: workflow,
  })

  return (
<Accordion type="single" collapsible>
  <AccordionItem value="item">
  <AccordionTrigger className="px-0">
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 select-none">
          <Label className="text-sm">{uiType}</Label>
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
    </div>
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-3">
        <TextField
          id={`title-${sectionId}`}
          label="제목"
          value={title || ''}
          placeholder="섹션 제목"
          onChange={(value) => withMeta((draft) => { (draft.sections[index].uiSchema as any).title = value })}
        />
        <TextField
          id={`placeholder-${sectionId}`}
          label="플레이스홀더"
          value={placeholder || ''}
          placeholder="예: 워크스페이스를 선택하세요"
          onChange={(value) => withMeta((draft) => { (draft.sections[index].uiSchema as any).placeholder = value })}
        />
        <WorkflowField
          id={`workflow-json-${sectionId}`}
          value={workflowText}
          onChange={handleWorkflowChange}
          error={workflowError}
          placeholder='{"version":"1.0","start":"start","steps":[...],"targetUrl":"https://..."}'
        />
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