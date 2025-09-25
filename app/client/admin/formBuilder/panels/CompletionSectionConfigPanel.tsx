import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import TextField from "./field/TextField";

interface CompletionSectionConfigPanelProps {
  sectionId: string;
  sectionIndex: number;
  title?: string;
  uiType: string;
  index: number;
  withMeta: (updater: (draft: any) => void) => void;
}

const CompletionSectionConfigPanel = ({
  sectionId,
  sectionIndex,
  title,
  uiType,
  index,
  withMeta,
}: CompletionSectionConfigPanelProps) => {
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
              value={title || ""}
              placeholder="섹션 제목"
              onChange={(value) =>
                withMeta((draft) => {
                  (draft.sections[index].uiSchema as any).title = value;
                })
              }
            />
            <div className="flex justify-end pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  withMeta((draft) => {
                    draft.sections.splice(index, 1);
                  });
                }}
              >
                삭제
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CompletionSectionConfigPanel;
