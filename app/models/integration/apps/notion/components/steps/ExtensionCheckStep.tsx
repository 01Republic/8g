import { Button } from "~/components/ui/button"
import { useEffect, useState } from "react"
import { LoaderCircleIcon } from "lucide-react"
import { CenteredSection } from "~/components/ui/centered-section"
import { LoadingCard } from "~/components/ui/loading-card"
import type { ExtensionStatus } from "~/models/integration/apps/slack/types";

interface ExtensionCheckStepProps {
  onNext: () => void
  extensionStatus: ExtensionStatus | null
  isChecking: boolean
  onCheckExtension: () => void
}

export function ExtensionCheckStep({
  onNext,
  extensionStatus,
  isChecking,
  onCheckExtension
}: ExtensionCheckStepProps) {
  // 최소 로딩 시간을 적용해 너무 빠른 전환을 방지
  const [minDelayDone, setMinDelayDone] = useState(false)

  // 의존성에 onCheckExtension을 넣지 않아 타이머가 반복 초기화되는 문제를 방지
  useEffect(() => {
    onCheckExtension()
    const timer = setTimeout(() => setMinDelayDone(true), 800)
    return () => clearTimeout(timer)
  }, [])

  // 설치됨이면 1.6초 후 자동 다음 단계로 이동(전환 속도 완화)
  useEffect(() => {
    if (extensionStatus?.installed) {
      const t = setTimeout(() => onNext(), 1600)
      return () => clearTimeout(t)
    }
  }, [extensionStatus?.installed, onNext])
  
  const getExtensionStatusDisplay = () => {
    // 결과가 아직 없을 때만 최소 지연을 적용
    if (isChecking || (!extensionStatus && !minDelayDone)) {
      return (
        <LoadingCard message="8G Extension 확인 중..." icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} />
      )
    }

    if (!extensionStatus) {
      return null
    }

    if (extensionStatus.installed) {
      const msg = `8G Extension 설치됨${extensionStatus.version ? ` v${extensionStatus.version}` : ''}`
      return (
        <LoadingCard icon={<span className="text-lg">✅</span>} message={msg} />
      )
    } else {
      return (
        <LoadingCard icon={<span className="text-lg">❌</span>} message="8G Extension이 설치되지 않았습니다" />
      )
    }
  }

  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">Extension 상태 확인</h3>
      
      <CenteredSection>{getExtensionStatusDisplay()}</CenteredSection>
      
      {!extensionStatus || extensionStatus.installed ? null : (
        <div className="flex justify-end pt-2">
          <Button 
            onClick={onCheckExtension}
            disabled={isChecking || !minDelayDone}
            variant="outline"
            className="px-8 py-2"
          >
            재시도
          </Button>
        </div>
      )}
    </div>
  )
}