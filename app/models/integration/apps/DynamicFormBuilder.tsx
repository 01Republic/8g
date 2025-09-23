import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { IntegrationAppType } from './IntegrationAppFormMetadata'
import { integrationAppFormMetadata } from './IntegrationAppFormMetadata'
import { useFetcher } from 'react-router'
import { SelectBoxSection } from './components/sections/SelectBoxSection'
import { CheckboxSection } from './components/sections/CheckboxSection'
import { TableSection } from './components/sections/TableSection'
import { InitialCheckSection } from './components/sections/InitialCheckSection'
import { CompletionSection } from './components/sections/CompletionSection'

export interface FormComponentProps {
  currentSection: number
  selectedItem: string
  onSelectedItemChange: (value: string) => void
  onSectionChange: (section: number) => void
  onModalClose: () => void
  organizationId: number
  productId: number
}

// No per-app hooks; everything is metadata-driven now
export function DynamicFormBuilder(app: IntegrationAppType) {
  const fetcher = useFetcher()
  const [saveError, setSaveError] = useState<string | null>(null)

  const meta = integrationAppFormMetadata[app]

  // internal components removed; using imported components instead

  return {
    buildSections: (props: FormComponentProps) => {

      const didSubmitRef = useRef(false)
      useEffect(() => {
        if (!didSubmitRef.current) return
        if (fetcher.data) {
          if ((fetcher.data as any).success) {
            props.onSectionChange(meta.sections.length)
            setSaveError(null)
          } else {
            console.error('Save integration failed:', (fetcher.data as any).error)
            setSaveError('데이터 저장에 실패했습니다: ' + (fetcher.data as any).error)
          }
          didSubmitRef.current = false
        }
      }, [fetcher.data, props.onSectionChange])

      const workspaceParsedRef = useRef<any[]>([])

      const result: ReactNode[] = []

      // Context shared across sections
      const contextRef = useRef<any>({})
      meta.sections.forEach((sectionMeta, index) => {
        const sectionIndex = index + 1

        if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'initial-check') {
          if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'initial-check') {
            result.push(
              <InitialCheckSection
                key={`section-${sectionIndex}`}
                title={sectionMeta.title}
                onNext={() => { props.onSelectedItemChange(''); props.onSectionChange(sectionIndex + 1) }}
              />
            )
          }

        } else if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'select-box') {
          if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'select-box') {
            result.push(
              <SelectBoxSection
                key={`section-${sectionIndex}`}
                title={sectionMeta.title}
                workflow={sectionMeta.uiSchema.workflow}
                placeholder="Workspace를 선택하세요"
                selectedValue={props.selectedItem}
                onSelectedValueChange={(v) => props.onSelectedItemChange(v)}
                onNext={() => { props.onSectionChange(sectionIndex + 1) }}
                onParsed={(list) => { workspaceParsedRef.current = list; contextRef.current.workspaceList = list; contextRef.current.workspace = props.selectedItem ? list[parseInt(props.selectedItem)] : null; }}
                ctx={contextRef.current}
              />
            )
          }

        } else if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'checkbox') {
          if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'checkbox') {
            const selectedWorkspaceFromUi = props.selectedItem ? workspaceParsedRef.current[parseInt(props.selectedItem)] : null
            const selectedId = selectedWorkspaceFromUi?.elementId
            const targetUrl = (app === 'slack' && selectedId) ? `https://${selectedId}.slack.com/admin` : undefined
            result.push(
              <CheckboxSection
                key={`section-${sectionIndex}`}
                title={sectionMeta.title}
                workflow={sectionMeta.uiSchema.workflow}
                targetUrl={targetUrl}
                onPrevious={() => { props.onSelectedItemChange(''); props.onSectionChange(sectionIndex - 1) }}
                onNext={() => props.onSectionChange(sectionIndex + 1)}
                ctx={{ ...contextRef.current, workspace: selectedWorkspaceFromUi }}
              />
            )
          }

        } else if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'table') {
          if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'table') {
            const selectedWorkspaceFromUi = props.selectedItem ? workspaceParsedRef.current[parseInt(props.selectedItem)] : null
            const selectedId = selectedWorkspaceFromUi?.elementId
            const targetUrl = (app === 'slack' && selectedId) ? `https://${selectedId}.slack.com/admin` : undefined
            result.push(
              <TableSection
                key={`section-${sectionIndex}`}
                title={sectionMeta.title}
                workflow={sectionMeta.uiSchema.workflow}
                targetUrl={targetUrl}
                selectedWorkspaceLabel={selectedWorkspaceFromUi?.elementText}
                onConfirm={(rows) => {
                  if (!selectedWorkspaceFromUi || !Array.isArray(rows) || rows.length === 0) return
                  const formData = new FormData()
                  formData.append('workspace', JSON.stringify(selectedWorkspaceFromUi))
                  formData.append('members', JSON.stringify(rows))
                  formData.append('productId', props.productId.toString())
                  didSubmitRef.current = true
                  fetcher.submit(formData, { method: 'POST' })
                }}
                ctx={{ ...contextRef.current, workspace: selectedWorkspaceFromUi }}
              />
            )
          }
        } else if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'completion') {
          result.push(<CompletionSection key={`section-${sectionIndex}`} />)
        }
      })

      return result
    },

    getSectionCount: () => meta.sections.length,

    getLoadingStates: () => {
      const states: Record<number, boolean> = {}
      meta.sections.forEach((sectionMeta, index) => {
        const sectionIndex = index + 1
        // UI는 메타데이터 기반 제너릭 렌더러가 각자 로딩을 표시하므로 기본값은 false
        states[sectionIndex] = false
        if (sectionMeta.uiSchema && sectionMeta.uiSchema.type === 'completion') states[sectionIndex] = (fetcher.state !== 'idle')
      })
      return states
    },
  }
}


