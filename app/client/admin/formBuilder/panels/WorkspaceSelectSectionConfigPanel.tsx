import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import type { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import type { Workflow } from "scordi-extension";
import type { AppFormSectionMeta } from "~/models/integration/types";
import WorkflowSelect from "./field/WorkflowSelect";
import TextField from "./field/TextField";
import { AvailableVariablesCard } from "../AvailableVariablesCard";

interface WorkspaceSelectSectionConfigPanelProps {
  sectionId: string;
  sectionIndex: number;
  title: string;
  placeholder: string;
  workflowId?: number;
  uiType: string;
  index: number;
  withMeta: (updater: (draft: any) => void) => void;
  workflows: IntegrationAppWorkflowMetadata[];
  allSections: AppFormSectionMeta[];
}

const WorkspaceSelectSectionConfigPanel = ({
  sectionId,
  sectionIndex,
  title,
  placeholder,
  workflowId,
  uiType,
  index,
  withMeta,
  workflows,
  allSections,
}: WorkspaceSelectSectionConfigPanelProps) => {
  const handleWorkflowChange = (selectedWorkflowId: number | undefined) => {
    const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId);
    withMeta((draft) => {
      (draft.sections[index].uiSchema as any).workflow =
        selectedWorkflow?.meta as Workflow;
      (draft.sections[index].uiSchema as any).workflowId = selectedWorkflowId;
    });
  };

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
            <AvailableVariablesCard
              sectionIndex={index}
              sections={allSections}
            />
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
            <TextField
              id={`placeholder-${sectionId}`}
              label="플레이스홀더"
              value={placeholder || ""}
              placeholder="예: 워크스페이스를 선택하세요"
              onChange={(value) =>
                withMeta((draft) => {
                  (draft.sections[index].uiSchema as any).placeholder = value;
                })
              }
            />
            <WorkflowSelect
              id={`workflow-select-${sectionId}`}
              value={workflowId}
              onChange={handleWorkflowChange}
              workflows={workflows}
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

export default WorkspaceSelectSectionConfigPanel;
