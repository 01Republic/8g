import { useEffect } from "react"
import { LoaderCircleIcon } from "lucide-react"
import type { SlackWorkspace } from "~/models/integration/apps/slack/types"
import { CenteredSection } from "~/components/ui/centered-section"
import { LoadingCard } from "~/components/ui/loading-card"
import { Button } from "~/components/ui/button"

interface AdminCheckStepProps {
  selectedWorkspace: SlackWorkspace | null
  isAdmin: boolean | null
  isCheckingAdmin: boolean
  onCheckAdminPermission: () => void
  onPrevious: () => void
  onNext: () => void
}

export function AdminCheckStep({
  selectedWorkspace,
  isAdmin,
  isCheckingAdmin,
  onCheckAdminPermission,
  onPrevious,
  onNext
}: AdminCheckStepProps) {
  useEffect(() => {
    if (!selectedWorkspace) return
    if (isAdmin === null && !isCheckingAdmin) {
      onCheckAdminPermission()
    }
  }, [selectedWorkspace, isAdmin, isCheckingAdmin, onCheckAdminPermission])

  useEffect(() => {
    if (isAdmin) {
      const t = setTimeout(() => onNext(), 600)
      return () => clearTimeout(t)
    }
  }, [isAdmin, onNext])

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">관리자 권한 확인</h3>
      {isAdmin === null && (
        <CenteredSection>
          <LoadingCard 
            icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} 
            message="워크스페이스 관리자 권한 확인 중..." 
          />
        </CenteredSection>
      )}
      {isAdmin === false && (
        <CenteredSection>
          <LoadingCard 
            icon={<span className="text-lg">❌</span>} 
            message="권한 없음: 워크스페이스 관리자만 접근할 수 있습니다." 
          />
          <div className="flex justify-end">
            <Button onClick={onPrevious} variant="outline" className="px-6 py-2">
              워크스페이스 다시 선택
            </Button>
          </div>
        </CenteredSection>
      )}
      {isAdmin === true && (
        <CenteredSection>
          <LoadingCard 
            icon={<span className="text-lg">✅</span>} 
            message="관리자 권한 확인됨" 
          />
        </CenteredSection>
      )}
    </div>
  )
}


