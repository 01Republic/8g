import type { ReactNode } from 'react'
import type { IntegrationAppFormMetadata, SelectBoxSectionSchema, TableSectionSchema, CheckboxSectionSchema } from '../IntegrationAppFormMetadata'
import type { FormComponentProps } from '../DynamicFormBuilder'
import { SelectBoxSection } from './sections/SelectBoxSection'
import { CheckboxSection } from './sections/CheckboxSection'
import { TableSection } from './sections/TableSection'
import { InitialCheckSection } from './sections/InitialCheckSection'
import { CompletionSection } from './sections/CompletionSection'

type SubmitFn = (payload: { workspace?: any; members?: any[]; productId: number }) => Promise<void>

export function buildSections(meta: IntegrationAppFormMetadata, props: FormComponentProps, onSubmit: SubmitFn): ReactNode[] {
  return meta.sections.map((sectionMeta, index) => {
    const sectionIndex = index + 1
    const uiSchema = sectionMeta.uiSchema
    const uiType = uiSchema?.type

    switch (uiType) {
      case 'initial-check':
        return (
          <InitialCheckSection
            key={`section-${sectionIndex}`}
            title={sectionMeta.title}
            onNext={() => { props.onSelectedItemChange(''); props.onSectionChange(sectionIndex + 1) }}
          />
        )

      case 'select-box':
        return (
          <SelectBoxSection
            key={`section-${sectionIndex}`}
            title={sectionMeta.title}
            workflow={(uiSchema as SelectBoxSectionSchema).workflow}
            placeholder="Workspace를 선택하세요"
            selectedValue={props.selectedItem}
            onSelectedValueChange={(v) => props.onSelectedItemChange(v)}
            onNext={() => { props.onSectionChange(sectionIndex + 1) }}
          />
        )

      case 'checkbox':
        return (
          <CheckboxSection
            key={`section-${sectionIndex}`}
            title={sectionMeta.title}
            workflow={(uiSchema as CheckboxSectionSchema).workflow}
            onPrevious={() => { props.onSelectedItemChange(''); props.onSectionChange(sectionIndex - 1) }}
            onNext={() => props.onSectionChange(sectionIndex + 1)}
          />
        )

      case 'table':
        return (
          <TableSection
            key={`section-${sectionIndex}`}
            title={sectionMeta.title}
            workflow={(uiSchema as TableSectionSchema).workflow}
            onNext={(rows) => {
              onSubmit({ workspace: props.selectedItem, members: rows, productId: props.productId })
              props.onSectionChange(sectionIndex + 1)
            }}
          />
        )

      case 'completion':
        return <CompletionSection key={`section-${sectionIndex}`} />

      default:
        return null
    }
  })
}


