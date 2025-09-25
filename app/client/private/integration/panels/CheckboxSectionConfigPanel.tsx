import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import type { FormWorkflow } from '~/models/integration/types'
import { useWorkflowConfig } from '~/hooks/use-workflow-config'
import WorkflowField from './field/WorkflowField'
import TextField from './field/TextField'

interface CheckboxSectionConfigPanelProps {
  sectionId: string
  sectionIndex: number
  title?: string
  placeholder: string
  loadingMessage: string
  errorMessage: string
  successMessage: string
  uiType: string
  index: number
  withMeta: (updater: (draft: any) => void) => void
  workflow?: FormWorkflow
}

const CheckboxSectionConfigPanel = ({
  sectionId,
  sectionIndex,
  title,
  placeholder,
  loadingMessage,
  errorMessage,
  successMessage,
  uiType,
  index,
  withMeta,
  workflow,
}: CheckboxSectionConfigPanelProps) => {
  const { workflowText, workflowError, handleWorkflowChange } = useWorkflowConfig({
    index,
    withMeta,
    initialWorkflow: workflow,
  })

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
            <TextField
              id={`title-${sectionId}`}
              label="제목"
              value={title || ''}
              placeholder="섹션 제목"
              onChange={(value) => withMeta((draft) => { (draft.sections[index].uiSchema as any).title = value })}
            />
            <TextField
              id={`cb-loading-${sectionId}`}
              label="로딩 메시지"
              value={loadingMessage || ''}
              onChange={(value) => withMeta((draft) => { (draft.sections[index].uiSchema as any).loadingMessage = value })}
            />
            <div className="space-y-2">
              <Label htmlFor={`cb-error-${sectionId}`}>에러 메시지</Label>
              <Textarea
                id={`cb-error-${sectionId}`}
                value={errorMessage || ''}
                onChange={(event) => withMeta((draft) => { (draft.sections[index].uiSchema as any).errorMessage = event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`cb-success-${sectionId}`}>성공 메시지</Label>
              <Textarea
                id={`cb-success-${sectionId}`}
                value={successMessage || ''}
                onChange={(event) => withMeta((draft) => { (draft.sections[index].uiSchema as any).successMessage = event.target.value })}
              />
            </div>
            <WorkflowField
              id={`workflow-json-${sectionId}`}
              value={workflowText}
              onChange={handleWorkflowChange}
              error={workflowError}
              placeholder='{"version":"1.0","start":"start","steps":[...],"targetUrl":"https://..."}'
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