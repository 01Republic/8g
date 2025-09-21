
import { useFetcher } from 'react-router'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useSlackAdmin } from '../hook/use-admin'
import { useSlackExtension } from '../hook/use-extension'
import { useSlackMembers } from '../hook/use-members'
import { useSlackWorkspaces } from '../hook/use-workspaces'
import { CompletionStep } from './steps/CompletionStep'
import { ExtensionCheckStep } from './steps/ExtensionCheckStep'
import { MemberListStep } from './steps/MemberListStep'
import { WorkspaceSelectionStep } from './steps/WorkspaceSelectionStep'

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
  const { extensionStatus, isChecking, checkExtension } = useSlackExtension()
  const { workspaces, isCollectingWorkspaces, collectWorkspaces } = useSlackWorkspaces()
  const { isAdmin, isCheckingAdmin, checkAdminPermission, resetAdminStatus } = useSlackAdmin()
  const { members: memberData, isCollectingMembers, collectMembers, resetMembers } = useSlackMembers()
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
        <ExtensionCheckStep
          key="step-1"
          extensionStatus={extensionStatus}
          isChecking={isChecking}
          onCheckExtension={checkExtension}
          onNext={() => props.onStepChange(2)}
        />,

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
          workspaces={workspaces}
          isCollectingWorkspaces={isCollectingWorkspaces}
          onCollectWorkspaces={collectWorkspaces}
        />,

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
        />,

        <CompletionStep
          key="step-4"
        />
      ]
    },

    getStepCount: () => 4,

    getLoadingStates: () => {
      return {
        1: !!isChecking,
        2: !!isCollectingWorkspaces,
        3: !!(isCheckingAdmin || isCollectingMembers),
        4: fetcher.state !== 'idle'
      }
    }
  }
}