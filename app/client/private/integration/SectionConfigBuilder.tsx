import type { AppFormSectionMeta, InitialCheckSectionSchema, SelectBoxSectionSchema, CheckboxSectionSchema, TableSectionSchema, CompletionSectionSchema } from "~/models/integration/types"
import CheckboxSectionConfigPanel from "./panels/CheckboxSectionConfigPanel"
import CompletionSectionConfigPanel from "./panels/CompletionSectionConfigPanel"
import InitialCheckSectionConfigPanel from "./panels/InitialCheckSectionConfigPanel"
import SelectBoxSectionConfigPanel from "./panels/SelectBoxSectionConfigPanel"
import TableSectionConfigPanel from "./panels/TableSectionConfigPanel"

interface BuildSectionConfigPanelProps {
  section: AppFormSectionMeta
  sectionIndex: number
  index: number
  withMeta: (updater: (draft: any) => void) => void
}

export default function SectionConfigBuilder({ section, sectionIndex, index, withMeta }: BuildSectionConfigPanelProps) {
  const ui: any = section.uiSchema as any
  const uiType: string = (ui?.type as string) || ""

  if (uiType === "initial-check") {
    const _ui = ui as InitialCheckSectionSchema
    return (
      <InitialCheckSectionConfigPanel
        sectionIndex={sectionIndex}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
      />
    )
  }

  if (uiType === "select-box") {
    const _ui = ui as SelectBoxSectionSchema
    return (
      <SelectBoxSectionConfigPanel
        sectionId={section.id}
        sectionIndex={sectionIndex}
        title={_ui.title || ""}
        placeholder={_ui.placeholder || ""}
        targetUrl={_ui.workflow?.targetUrl || ""}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
      />
    )
  }

  if (uiType === "checkbox") {
    const _ui = ui as CheckboxSectionSchema
    return (
      <CheckboxSectionConfigPanel
        sectionId={section.id}
        sectionIndex={sectionIndex}
        placeholder={_ui.placeholder || ""}
        loadingMessage={_ui.loadingMessage || ""}
        errorMessage={_ui.errorMessage || ""}
        successMessage={_ui.successMessage || ""}
        targetUrl={_ui.workflow?.targetUrl || ""}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
      />
    )
  }

  if (uiType === "table") {
    const _ui = ui as TableSectionSchema
    return (
      <TableSectionConfigPanel
        sectionId={section.id}
        sectionIndex={sectionIndex}
        targetUrl={_ui.workflow?.targetUrl || ""}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
      />
    )
  }

  if (uiType === "completion") {
    const _ui = ui as CompletionSectionSchema
    return (
      <CompletionSectionConfigPanel
        sectionIndex={sectionIndex}
        uiType={_ui.type}
        index={index}
        withMeta={withMeta}
      />
    )
  }

  return null
}


