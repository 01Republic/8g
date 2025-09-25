import type { ReactNode } from 'react'
import type { FormComponentProps } from './DynamicFormBuilder'
import { SelectBoxSection } from './sections/SelectBoxSection'
import { CheckboxSection } from './sections/CheckboxSection'
import { TableSection } from './sections/TableSection'
import { InitialCheckSection } from './sections/InitialCheckSection'
import { CompletionSection } from './sections/CompletionSection'
import type { SelectedWorkspace } from '~/models/integration/types'
import type { SelectedMembers } from '~/models/integration/types'
import type { IntegrationAppFormMetadata } from '~/models/integration/apps/types'
import type { FormSectionSchema, SelectBoxSectionSchema, CheckboxSectionSchema, TableSectionSchema } from '~/models/integration/apps/types'

export const buildSections = (meta: IntegrationAppFormMetadata, props: FormComponentProps): ReactNode[] => {
  return meta.sections.map((sectionMeta, index) => {
    const sectionIndex = index + 1
    const uiSchema = sectionMeta.uiSchema
    const sectionCount = meta.sections.length
    const hasPrevious = sectionIndex > 1
    const hasNext = sectionIndex < sectionCount

    const goNext = () => props.onSectionChange(sectionIndex + 1)
    const goPrev = () => props.onSectionChange(sectionIndex - 1)

    return buildSection(
      uiSchema,
      goNext,
      goPrev,
      props.onSubmit,
      props.onSelectedWorkspaceChange,
      props.selectedWorkspace,
      props.onSelectedMembersChange,
      props.selectedMembers,
      sectionIndex,
      hasPrevious,
      hasNext,
    )
  })
}


export const buildSection = (
  uiSchema: FormSectionSchema,
  onNext: () => void,
  onPrevious: () => void,
  onSubmit: () => void,
  onSelectedWorkspaceChange: (v: SelectedWorkspace) => void,
  selectedWorkspace: SelectedWorkspace | null,
  onSelectedMembersChange: (v: SelectedMembers[]) => void,
  selectedMembers: SelectedMembers[],
  keyId: string | number,
  hasPrevious: boolean,
  hasNext: boolean,
) => {
  const uiType = uiSchema?.type

  switch (uiType) {
    case 'initial-check':
      return (
        <InitialCheckSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          onNext={onNext as () => void}
          onPrevious={onPrevious}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )

    case 'select-box':
      return (
        <SelectBoxSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          workflow={(uiSchema as SelectBoxSectionSchema).workflow}
          placeholder={(uiSchema as SelectBoxSectionSchema).placeholder}
          selectedWorkspace={selectedWorkspace}
          onSelectedWorkspaceChange={onSelectedWorkspaceChange}
          onNext={onNext as () => void}
          onPrevious={onPrevious}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )

    case 'checkbox':
      return (
        <CheckboxSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          workflow={(uiSchema as CheckboxSectionSchema).workflow}
          loadingMessage={(uiSchema as CheckboxSectionSchema).loadingMessage}
          errorMessage={(uiSchema as CheckboxSectionSchema).errorMessage}
          successMessage={(uiSchema as CheckboxSectionSchema).successMessage}
          onPrevious={onPrevious}
          onNext={onNext as () => void}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )

    case 'table':
      return (
        <TableSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          workflow={(uiSchema as TableSectionSchema).workflow}
          onSelectedMembersChange={onSelectedMembersChange}
          selectedMembers={selectedMembers}
          onNext={onNext as (rows: any[]) => void}
          onPrevious={onPrevious}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )

    case 'completion':
      return (
        <CompletionSection
          key={`section-${keyId}`}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPrevious={onPrevious}
          onSubmit={onSubmit}
        />
      )

    default:
      return null
  }
}