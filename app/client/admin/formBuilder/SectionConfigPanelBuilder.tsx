import type {
  AppFormSectionMeta,
  InitialCheckSectionSchema,
  WorkspaceSelectSectionSchema,
  PermissionCheckSectionSchema,
  MemberTableSectionSchema,
  CompletionSectionSchema,
} from "~/models/integration/types";
import type { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import PermissionCheckSectionConfigPanel from "./panels/PermissionCheckSectionConfigPanel";
import CompletionSectionConfigPanel from "./panels/CompletionSectionConfigPanel";
import InitialCheckSectionConfigPanel from "./panels/InitialCheckSectionConfigPanel";
import WorkspaceSelectSectionConfigPanel from "./panels/WorkspaceSelectSectionConfigPanel";
import MemberTableSectionConfigPanel from "./panels/MemberTableSectionConfigPanel";

interface BuildSectionConfigPanelProps {
  section: AppFormSectionMeta;
  sectionIndex: number;
  index: number;
  withMeta: (updater: (draft: any) => void) => void;
  workflows: IntegrationAppWorkflowMetadata[];
  allSections: AppFormSectionMeta[];
}

export default function SectionConfigPanelBuilder({
  section,
  sectionIndex,
  index,
  withMeta,
  workflows,
  allSections,
}: BuildSectionConfigPanelProps) {
  const ui: any = section.uiSchema as any;
  const uiType: string = (ui?.type as string) || "";

  if (uiType === "initial-check") {
    const _ui = ui as InitialCheckSectionSchema;
    return (
      <InitialCheckSectionConfigPanel
        sectionId={section.id}
        sectionIndex={sectionIndex}
        title={_ui.title || ""}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
      />
    );
  }

  if (uiType === "workspace-select") {
    const _ui = ui as WorkspaceSelectSectionSchema;
    return (
      <WorkspaceSelectSectionConfigPanel
        sectionId={section.id}
        sectionIndex={sectionIndex}
        title={_ui.title || ""}
        placeholder={_ui.placeholder || ""}
        workflowId={_ui.workflowId}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
        workflows={workflows}
        allSections={allSections}
      />
    );
  }

  if (uiType === "permission-check") {
    const _ui = ui as PermissionCheckSectionSchema;
    return (
      <PermissionCheckSectionConfigPanel
        sectionId={section.id}
        sectionIndex={sectionIndex}
        title={_ui.title || ""}
        placeholder={_ui.placeholder || ""}
        loadingMessage={_ui.loadingMessage || ""}
        errorMessage={_ui.errorMessage || ""}
        successMessage={_ui.successMessage || ""}
        workflowId={_ui.workflowId}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
        workflows={workflows}
        allSections={allSections}
      />
    );
  }

  if (uiType === "member-table") {
    const _ui = ui as MemberTableSectionSchema;
    return (
      <MemberTableSectionConfigPanel
        sectionId={section.id}
        sectionIndex={sectionIndex}
        title={_ui.title || ""}
        workflowId={_ui.workflowId}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
        workflows={workflows}
        allSections={allSections}
      />
    );
  }

  if (uiType === "completion") {
    const _ui = ui as CompletionSectionSchema;
    return (
      <CompletionSectionConfigPanel
        sectionId={section.id}
        sectionIndex={sectionIndex}
        title={_ui.title || ""}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
      />
    );
  }

  return null;
}
