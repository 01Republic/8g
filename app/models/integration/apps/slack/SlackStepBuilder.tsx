import { ExtensionCheckStep } from './steps/ExtensionCheckStep'
import { WorkspaceSelectionStep } from './steps/WorkspaceSelectionStep' 
import { MemberListStep } from './steps/MemberListStep'
import { CompletionStep } from './steps/CompletionStep'
import { useExtensionCheck } from '~/models/integration/hook/slack/use-extension-check'
import { useWorkspaceCollection } from '~/models/integration/hook/slack/use-workspace-collection'
import { useAdminPermission } from '~/models/integration/hook/slack/use-admin-permission'
import { useMemberCollection } from '~/models/integration/hook/slack/use-member-collection'
import { useFetcher } from 'react-router'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

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

export function SlackStepBuilder(): StepBuilder {
  const { extensionStatus } = useExtensionCheck()
  const { workspaces } = useWorkspaceCollection()
  const { isAdmin, isCheckingAdmin, checkAdminPermission, resetAdminStatus } = useAdminPermission()
  const { members: memberData, isCollectingMembers, collectMembers, resetMembers } = useMemberCollection()
  const fetcher = useFetcher()
  
  return {
    buildSteps: (props: StepComponentProps) => {
      const selectedWorkspace = props.selectedItem ? workspaces[parseInt(props.selectedItem)] : null

      const handleCheckAdminPermission = () => {
        if (selectedWorkspace) {
          checkAdminPermission(selectedWorkspace.elementId)
        }
      }

      const handleCollectMembers = () => {
        if (selectedWorkspace) {
          collectMembers(selectedWorkspace.elementId)
        }
      }

      const handleSaveIntegration = async () => {
        if (!selectedWorkspace || memberData.length === 0) {
          alert('워크스페이스와 멤버 데이터가 필요합니다.')
          return
        }
        
        const formData = new FormData()
        formData.append('workspace', JSON.stringify(selectedWorkspace))
        formData.append('members', JSON.stringify(memberData))
        formData.append('productId', props.productId.toString())

        fetcher.submit(formData, { method: 'POST' })
      }

      // Handle fetcher response with useEffect
      useEffect(() => {
        if (fetcher.data) {
          if (fetcher.data.success) {
            props.onStepChange(4)
          } else {
            console.error('Save integration failed:', fetcher.data.error)
            alert('데이터 저장에 실패했습니다: ' + fetcher.data.error)
          }
        }
      }, [fetcher.data, props.onStepChange])

      return [
        extensionStatus?.installed ? null : (
          <ExtensionCheckStep
            key="step-1"
            onNext={() => props.onStepChange(2)}
          />
        ),
        
        workspaces.length === 0 ? null : (
          <WorkspaceSelectionStep
            key="step-2"
            selectedItem={props.selectedItem}
            onSelectedItemChange={props.onSelectedItemChange}
            onPrevious={() => props.onStepChange(1)}
            onNext={() => {
              props.onStepChange(3)
              resetAdminStatus()
              resetMembers()
            }}
          />
        ),

        selectedWorkspace ? (
          <MemberListStep
            key="step-3"
            selectedWorkspace={selectedWorkspace}
            isAdmin={isAdmin}
            isCheckingAdmin={isCheckingAdmin}
            onCheckAdminPermission={handleCheckAdminPermission}
            memberData={memberData}
            isCollectingMembers={isCollectingMembers}
            onCollectMembers={handleCollectMembers}
            onPrevious={() => props.onStepChange(2)}
            onNext={handleSaveIntegration}
          />
        ) : null,

        <CompletionStep
          key="step-4"
        />
      ].filter(Boolean)
    },

    getStepCount: () => 4,

    getLoadingStates: () => {
      return {
        1: false,
        2: false,
        3: false,
        4: false
      }
    }
  }
}