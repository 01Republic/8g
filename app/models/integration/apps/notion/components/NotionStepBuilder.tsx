
import { useFetcher } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNotionExtension } from '../hook/use-extension'
import { useNotionWorkspaces } from '../hook/use-workspaces'
import { useNotionAdmin } from '../hook/use-admin'
import { CompletionStep } from './steps/CompletionStep'
import { ExtensionCheckStep } from './steps/ExtensionCheckStep'
import { WorkspaceSelectionStep } from './steps/WorkspaceSelectionStep'
import { AdminCheckStep } from './steps/AdminCheckStep'
import { MemberSyncStep } from './steps/MemberSyncStep'
import { useNotionMembers } from '../hook/use-members'

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

export function NotionStepBuilder(): StepBuilder {
  const { extensionStatus, isChecking, checkExtension } = useNotionExtension()
  const { workspaces, isCollectingWorkspaces, collectWorkspaces } = useNotionWorkspaces()
  const { isAdmin, isCheckingAdmin, checkAdminPermission, resetAdminStatus } = useNotionAdmin()
  const { members: memberData, isCollectingMembers, membersError, collectMembers, resetMembers, setMembersError } = useNotionMembers()
  const fetcher = useFetcher()
  const [saveError, setSaveError] = useState<string | null>(null)

  return {
    buildSteps: (props: StepComponentProps) => {
      const selectedWorkspace = useMemo(() => (
        props.selectedItem ? workspaces[parseInt(props.selectedItem)] : null
      ), [props.selectedItem, workspaces])

      const handleCheckAdminPermission = () => {
        if (selectedWorkspace) {
          checkAdminPermission(selectedWorkspace.elementXPath)
        }
      }

      const handleCollectMembers = () => {
        if (selectedWorkspace) {
          collectMembers(selectedWorkspace.elementXPath)
        }
      }

      const handleSaveIntegration = async () => {
        if (!selectedWorkspace || memberData.length === 0) {
          setSaveError('워크스페이스와 멤버 데이터가 필요합니다.')
          return
        }
        
        const formData = new FormData()
        formData.append('workspace', JSON.stringify(selectedWorkspace))
        formData.append('members', JSON.stringify(memberData))
        formData.append('productId', props.productId.toString())

        fetcher.submit(formData, { method: 'POST' })
      }

      useEffect(() => {
        if (fetcher.data) {
          if (fetcher.data.success) {
            props.onStepChange(5)
            setSaveError(null)
          } else {
            console.error('Save integration failed:', fetcher.data.error)
            setSaveError('데이터 저장에 실패했습니다: ' + fetcher.data.error)
          }
        }
      }, [fetcher.data, props.onStepChange])

      return [
        <ExtensionCheckStep
          key="step-1"
          extensionStatus={extensionStatus}
          isChecking={isChecking}
          onCheckExtension={checkExtension}
          onNext={() => { 
            props.onSelectedItemChange("")
            props.onStepChange(2)
          }}
        />,

        <WorkspaceSelectionStep
          key="step-2"
          selectedItem={props.selectedItem}
          onSelectedItemChange={props.onSelectedItemChange}
          onNext={() => {
            props.onStepChange(3)
            resetAdminStatus()
            resetMembers()
          }}
          workspaces={workspaces}
          isCollectingWorkspaces={isCollectingWorkspaces}
          onCollectWorkspaces={collectWorkspaces}
        />,

        <AdminCheckStep
          key="step-3"
          selectedWorkspace={selectedWorkspace}
          isAdmin={isAdmin}
          isCheckingAdmin={isCheckingAdmin}
          onCheckAdminPermission={handleCheckAdminPermission}
          onPrevious={() => {
            props.onSelectedItemChange("")
            props.onStepChange(2)
          }}
          onNext={() => props.onStepChange(4)}
        />,

        <MemberSyncStep
          key="step-4"
          selectedWorkspace={selectedWorkspace}
          memberData={memberData}
          isCollectingMembers={isCollectingMembers}
          onCollectMembers={handleCollectMembers}
          onNext={handleSaveIntegration}
        />,

        <CompletionStep key="step-5" />
      ]
    },

    getStepCount: () => 5,

    getLoadingStates: () => {
      return {
        1: !!isChecking,
        2: !!isCollectingWorkspaces,
        3: !!isCheckingAdmin,
        4: !!isCollectingMembers,
        5: fetcher.state !== 'idle'
      }
    }
  }
}