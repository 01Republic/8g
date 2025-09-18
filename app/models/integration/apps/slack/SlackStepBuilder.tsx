import { ExtensionCheckStep } from './steps/ExtensionCheckStep'
import { WorkspaceSelectionStep } from './steps/WorkspaceSelectionStep' 
import { MemberListStep } from './steps/MemberListStep'
import { CompletionStep } from './steps/CompletionStep'
import { useSlackIntegration } from '~/models/integration/hook/use-slack-integration'
import type { ReactNode } from 'react'

export interface StepComponentProps {
  currentStep: number
  selectedItem: string
  onSelectedItemChange: (value: string) => void
  onStepChange: (step: number) => void
  onModalClose: () => void
}

export interface StepBuilder {
  buildSteps: (props: StepComponentProps) => ReactNode[]
  getStepCount: () => number
  getLoadingStates: () => Record<number, boolean>
}

export function SlackStepBuilder(): StepBuilder {
  return {
    buildSteps: (props: StepComponentProps) => {
      const {
        extensionStatus,
        isChecking,
        checkExtension,
        workspaces,
        isCollectingWorkspaces,
        collectWorkspaces,
        isAdmin,
        isCheckingAdmin,
        checkAdminPermission,
        members: memberData,
        isCollectingMembers,
        collectMembers,
        resetAdminStatus,
        resetMembers,
      } = useSlackIntegration()

      const handleTestDataCollection = async () => {
        try {
          await collectWorkspaces()
        } catch (error) {
          console.error('Data collection failed:', error)
          alert('데이터 수집에 실패했습니다: ' + (error instanceof Error ? error.message : 'Unknown error'))
        }
      }

      const handleCheckAdminPermission = async () => {
        if (!props.selectedItem || !workspaces[parseInt(props.selectedItem)]) {
          alert('먼저 workspace를 선택해주세요.')
          return
        }

        const selectedWorkspace = workspaces[parseInt(props.selectedItem)]
        const workspaceId = selectedWorkspace.elementId
        
        try {
          await checkAdminPermission(workspaceId)
        } catch (error) {
          console.error('Admin permission check failed:', error)
          alert('관리자 권한 확인에 실패했습니다: ' + (error instanceof Error ? error.message : 'Unknown error'))
        }
      }

      const handleFetchMembers = async () => {
        if (!props.selectedItem || !workspaces[parseInt(props.selectedItem)]) {
          alert('먼저 workspace를 선택해주세요.')
          return
        }

        const selectedWorkspace = workspaces[parseInt(props.selectedItem)]
        const workspaceId = selectedWorkspace.elementId
        
        try {
          await collectMembers(workspaceId)
        } catch (error) {
          console.error('Member data collection failed:', error)
          alert('멤버 데이터 수집에 실패했습니다: ' + (error instanceof Error ? error.message : 'Unknown error'))
        }
      }

      return [
        <ExtensionCheckStep
          key="step-1"
          extensionStatus={extensionStatus}
          isChecking={isChecking}
          checkExtension={checkExtension}
          onNext={() => props.onStepChange(2)}
        />,
        
        extensionStatus?.installed ? (
          <WorkspaceSelectionStep
            key="step-2"
            workspaces={workspaces}
            isCollectingWorkspaces={isCollectingWorkspaces}
            selectedItem={props.selectedItem}
            onSelectedItemChange={props.onSelectedItemChange}
            onCollectWorkspaces={handleTestDataCollection}
            onPrevious={() => props.onStepChange(1)}
            onNext={() => {
              props.onStepChange(3)
              resetAdminStatus()
              resetMembers()
            }}
          />
        ) : null,

        <MemberListStep
          key="step-3"
          isAdmin={isAdmin}
          isCheckingAdmin={isCheckingAdmin}
          memberData={memberData}
          isCollectingMembers={isCollectingMembers}
          selectedItem={props.selectedItem}
          onCheckAdminPermission={handleCheckAdminPermission}
          onCollectMembers={handleFetchMembers}
          onPrevious={() => props.onStepChange(2)}
          onNext={() => props.onStepChange(4)}
        />,

        <CompletionStep
          key="step-4"
        />
      ]
    },

    getStepCount: () => 4,

    getLoadingStates: () => {
      const {
        isChecking,
        isCollectingWorkspaces,
        isCollectingMembers
      } = useSlackIntegration()

      return {
        1: isChecking,
        2: isCollectingWorkspaces,
        3: isCollectingMembers,
        4: false
      }
    }
  }
}