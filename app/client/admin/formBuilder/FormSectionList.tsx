import { useState } from "react";
import { Plus } from "lucide-react";

import Reorderable from "~/components/Reorderable";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import type {
  CheckboxSectionSchema,
  CompletionSectionSchema,
  InitialCheckSectionSchema,
  IntegrationAppFormMetadata,
  SelectBoxSectionSchema,
  TableSectionSchema,
} from "~/models/integration/types";
import SectionConfigPanelBuilder from "~/client/admin/formBuilder/SectionConfigPanelBuilder";

const buildInitialCheckSectionSchema = () => {
  const defaultSchema: InitialCheckSectionSchema = {
    type: "initial-check",
    title: "초기 체크",
  };

  return defaultSchema;
};

const buildSelectBoxSectionSchema = () => {
  const defaultSchema: SelectBoxSectionSchema = {
    type: "select-box",
    title: "선택 박스",
    placeholder: "선택 박스",
    workflow: {
      version: "1.0.0",
      start: "start",
      steps: [],
      parser: () => {},
      targetUrl: "https://example.com",
    },
  };

  return defaultSchema;
};

const buildCheckboxSectionSchema = () => {
  const defaultSchema: CheckboxSectionSchema = {
    type: "checkbox",
    title: "체크박스",
    placeholder: "체크박스",
    loadingMessage: "체크박스",
    errorMessage: "체크박스",
    successMessage: "체크박스",
    workflow: {
      version: "1.0.0",
      start: "start",
      steps: [],
      parser: () => {},
      targetUrl: "https://example.com",
    },
  };

  return defaultSchema;
};

const buildTableSectionSchema = () => {
  const defaultSchema: TableSectionSchema = {
    type: "table",
    title: "테이블",
    workflow: {
      version: "1.0.0",
      start: "start",
      steps: [],
      parser: () => {},
      targetUrl: "https://example.com",
    },
  };

  return defaultSchema;
};

const buildCompletionSectionSchema = () => {
  const defaultSchema: CompletionSectionSchema = {
    type: "completion",
    title: "완료",
  };

  return defaultSchema;
};

export const SectionTypePropsMapper = {
  "initial-check": buildInitialCheckSectionSchema,
  "select-box": buildSelectBoxSectionSchema,
  checkbox: buildCheckboxSectionSchema,
  table: buildTableSectionSchema,
  completion: buildCompletionSectionSchema,
};

interface FormSectionListProps {
  meta: IntegrationAppFormMetadata;
  withMeta: (updater: (draft: IntegrationAppFormMetadata) => void) => void;
  currentSection: number;
  setCurrentSection: (index: number) => void;
  dndType: string;
}

export const FormSectionList = (props: FormSectionListProps) => {
  const {
    meta,
    withMeta: updateMeta,
    currentSection,
    setCurrentSection,
    dndType,
  } = props;
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  const handleAddSection = (type: keyof typeof SectionTypePropsMapper) => {
    const builder = SectionTypePropsMapper[type];
    if (!builder) return;

    const nextIndex = meta.sections.length + 1;
    updateMeta((draft) => {
      draft.sections.push({
        id: `section-${draft.sections.length + 1}`,
        uiSchema: builder(),
      });
    });
    setCurrentSection(nextIndex);
    setIsAddSectionOpen(false);
  };

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const selectedId =
      currentSection > 0 ? meta.sections[currentSection - 1]?.id : undefined;
    updateMeta((draft) => {
      const dragged = draft.sections[dragIndex];
      draft.sections.splice(dragIndex, 1);
      draft.sections.splice(hoverIndex, 0, dragged);
      if (selectedId) {
        const newIndex = draft.sections.findIndex((s) => s.id === selectedId);
        if (newIndex >= 0) setCurrentSection(newIndex + 1);
      }
    });
  };

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="space-y-4">
        {meta.sections.map((section, index) => {
          const sectionIndex = index + 1;
          const isActive = currentSection === sectionIndex;
          return (
            <Reorderable
              key={section.id}
              index={index}
              move={moveSection}
              isActive={isActive}
              onClick={() => setCurrentSection(sectionIndex)}
              dndType={dndType}
            >
              {SectionConfigPanelBuilder({
                section,
                sectionIndex,
                index,
                withMeta: updateMeta,
              })}
            </Reorderable>
          );
        })}
      </div>

      <Separator />

      <Popover open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-center gap-2">
            <Plus className="size-4" />
            섹션 추가
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-56 p-2">
          <div className="grid gap-1">
            {Object.entries(SectionTypePropsMapper).map(([type]) => (
              <Button
                key={type}
                variant="ghost"
                className="justify-start"
                onClick={() =>
                  handleAddSection(type as keyof typeof SectionTypePropsMapper)
                }
              >
                {type}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
