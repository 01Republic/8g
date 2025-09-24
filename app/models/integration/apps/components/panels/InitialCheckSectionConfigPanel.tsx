import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

interface InitialCheckSectionConfigPanelProps {
  sectionIndex: number
  uiType: string
  index: number
  withMeta: (updater: (draft: any) => void) => void
}

const InitialCheckSectionConfigPanel = ({ sectionIndex, uiType, index, withMeta }: InitialCheckSectionConfigPanelProps) => {
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

export default InitialCheckSectionConfigPanel