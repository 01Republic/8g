import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { IntegrationAppType, StepType } from './metadata'
import { integrationAppStepsMetadata } from './metadata'
import { useFetcher } from 'react-router'
import { SelectBoxStep } from './components/steps/SelectBoxStep'
import { CheckboxStep } from './components/steps/CheckboxStep'
import { TableStep } from './components/steps/TableStep'
import { InitialCheckStep } from './components/steps/InitialCheckStep'
import { CompletionStep } from './components/steps/CompletionStep'

export interface StepComponentProps {
  currentStep: number
  selectedItem: string
  onSelectedItemChange: (value: string) => void
  onStepChange: (step: number) => void
  onModalClose: () => void
  organizationId: number
  productId: number
}

export interface StepBuilder {
  buildSteps: (props: StepComponentProps) => ReactNode[]
  getStepCount: () => number
  getLoadingStates: () => Record<number, boolean>
}

// No per-app hooks; everything is metadata-driven now
export function DynamicStepBuilder(app: IntegrationAppType) {
  const fetcher = useFetcher()
  const [saveError, setSaveError] = useState<string | null>(null)

  const meta = integrationAppStepsMetadata[app]

  // internal components removed; using imported components instead

  return {
    buildSteps: (props: StepComponentProps) => {

      const didSubmitRef = useRef(false)
      useEffect(() => {
        if (!didSubmitRef.current) return
        if (fetcher.data) {
          if ((fetcher.data as any).success) {
            props.onStepChange(meta.steps.length)
            setSaveError(null)
          } else {
            console.error('Save integration failed:', (fetcher.data as any).error)
            setSaveError('데이터 저장에 실패했습니다: ' + (fetcher.data as any).error)
          }
          didSubmitRef.current = false
        }
      }, [fetcher.data, props.onStepChange])

      const workspaceParsedRef = useRef<any[]>([])

      const result: ReactNode[] = []

      // Context shared across steps
      const contextRef = useRef<any>({})
      meta.steps.forEach((stepMeta, index) => {
        const type = stepMeta.type
        const stepIndex = index + 1

        if (type === 'extension') {
          if (stepMeta.uiSchema && stepMeta.uiSchema.type === 'initial-check') {
            result.push(
              <InitialCheckStep
                key={`step-${stepIndex}`}
                title={stepMeta.title}
                onNext={() => { props.onSelectedItemChange(''); props.onStepChange(stepIndex + 1) }}
              />
            )
          }

        } else if (type === 'workspace') {
          if (stepMeta.uiSchema && stepMeta.uiSchema.type === 'select-box') {
            result.push(
              <SelectBoxStep
                key={`step-${stepIndex}`}
                title={stepMeta.title}
                workflow={stepMeta.uiSchema.workflow}
                placeholder="Workspace를 선택하세요"
                selectedValue={props.selectedItem}
                onSelectedValueChange={(v) => props.onSelectedItemChange(v)}
                onNext={() => { props.onStepChange(stepIndex + 1) }}
                onParsed={(list) => { workspaceParsedRef.current = list; contextRef.current.workspaceList = list; contextRef.current.workspace = props.selectedItem ? list[parseInt(props.selectedItem)] : null; }}
                ctx={contextRef.current}
              />
            )
          }

        } else if (type === 'admin') {
          if (stepMeta.uiSchema && stepMeta.uiSchema.type === 'checkbox') {
            const selectedWorkspaceFromUi = props.selectedItem ? workspaceParsedRef.current[parseInt(props.selectedItem)] : null
            const selectedId = selectedWorkspaceFromUi?.elementId
            const targetUrl = (app === 'slack' && selectedId) ? `https://${selectedId}.slack.com/admin` : undefined
            result.push(
              <CheckboxStep
                key={`step-${stepIndex}`}
                title={stepMeta.title}
                workflow={stepMeta.uiSchema.workflow}
                targetUrl={targetUrl}
                onPrevious={() => { props.onSelectedItemChange(''); props.onStepChange(stepIndex - 1) }}
                onNext={() => props.onStepChange(stepIndex + 1)}
                ctx={{ ...contextRef.current, workspace: selectedWorkspaceFromUi }}
              />
            )
          }

        } else if (type === 'members') {
          if (stepMeta.uiSchema && stepMeta.uiSchema.type === 'table') {
            const selectedWorkspaceFromUi = props.selectedItem ? workspaceParsedRef.current[parseInt(props.selectedItem)] : null
            const selectedId = selectedWorkspaceFromUi?.elementId
            const targetUrl = (app === 'slack' && selectedId) ? `https://${selectedId}.slack.com/admin` : undefined
            result.push(
              <TableStep
                key={`step-${stepIndex}`}
                title={stepMeta.title}
                workflow={stepMeta.uiSchema.workflow}
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
        } else if (type === 'completion') {
          result.push(<CompletionStep key={`step-${stepIndex}`} />)
        }
      })

      return result
    },

    getStepCount: () => meta.steps.length,

    getLoadingStates: () => {
      const states: Record<number, boolean> = {}
      const types: StepType[] = meta.steps.map(({ type }) => type)
      types.forEach((type, index) => {
        const step = index + 1
        // UI는 메타데이터 기반 제너릭 렌더러가 각자 로딩을 표시하므로 기본값은 false
        states[step] = false
        if (type === 'completion') states[step] = (fetcher.state !== 'idle')
      })
      return states
    },
  }
}


