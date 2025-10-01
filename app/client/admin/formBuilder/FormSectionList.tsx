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
  PermissionCheckSectionSchema,
  CompletionSectionSchema,
  InitialCheckSectionSchema,
  AppFormMetadata,
  WorkspaceSelectSectionSchema,
  MemberTableSectionSchema,
} from "~/models/integration/types";
import type { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import SectionConfigPanelBuilder from "~/client/admin/formBuilder/SectionConfigPanelBuilder";

const buildInitialCheckSectionSchema = () => {
  const defaultSchema: InitialCheckSectionSchema = {
    type: "initial-check",
    title: "초기 체크",
  };

  return defaultSchema;
};

const buildWorkspaceSelectSectionSchema = () => {
  const defaultSchema: WorkspaceSelectSectionSchema = {
    type: "workspace-select",
    title: "워크스페이스 선택",
    placeholder: "워크스페이스를 선택하세요",
    workflow: {
      version: "1.0.0",
      start: "start",
      steps: [],
      targetUrl: "https://example.com",
    },
  };

  return defaultSchema;
};

const buildPermissionCheckSectionSchema = () => {
  const defaultSchema: PermissionCheckSectionSchema = {
    type: "permission-check",
    title: "권한 확인",
    placeholder: "권한 확인",
    loadingMessage: "권한 확인 중...",
    errorMessage: "권한이 없습니다",
    successMessage: "권한이 확인되었습니다",
    workflow: {
      version: "1.0.0",
      start: "start",
      steps: [],
      targetUrl: "https://example.com",
    },
  };

  return defaultSchema;
};

const buildMemberTableSectionSchema = () => {
  const defaultSchema: MemberTableSectionSchema = {
    type: "member-table",
    title: "멤버 목록",
    workflow: {
      version: "1.0.0",
      start: "start",
      steps: [],
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
  "workspace-select": buildWorkspaceSelectSectionSchema,
  "permission-check": buildPermissionCheckSectionSchema,
  "member-table": buildMemberTableSectionSchema,
  completion: buildCompletionSectionSchema,
};

interface FormSectionListProps {
  meta: AppFormMetadata;
  withMeta: (updater: (draft: AppFormMetadata) => void) => void;
  currentSection: number;
  setCurrentSection: (index: number) => void;
  dndType: string;
  workflows: IntegrationAppWorkflowMetadata[];
}

export const FormSectionList = (props: FormSectionListProps) => {
  const {
    meta,
    withMeta: updateMeta,
    currentSection,
    setCurrentSection,
    dndType,
    workflows,
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
                workflows,
                allSections: meta.sections,
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
