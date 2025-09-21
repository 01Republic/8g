import { Button } from "~/components/ui/button"
import { useExtensionCheck } from "~/models/integration/hook/slack/use-extension-check";

interface ExtensionCheckStepProps {
  onNext: () => void
}

export function ExtensionCheckStep({
  onNext
}: ExtensionCheckStepProps) {
  const { extensionStatus, isChecking, checkExtension } = useExtensionCheck();
  
  const getExtensionStatusDisplay = () => {
    if (isChecking) {
      return (
        <div className="flex items-center gap-2 text-yellow-600">
          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
          <span>8G Extension 확인 중...</span>
        </div>
      )
    }

    if (!extensionStatus) {
      return null
    }

    if (extensionStatus.installed) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <span className="text-lg">✅</span>
          <div>
            <span>8G Extension 설치됨</span>
            {extensionStatus.version && (
              <span className="text-sm text-gray-500 ml-2">v{extensionStatus.version}</span>
            )}
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <span className="text-lg">❌</span>
          <span>8G Extension이 설치되지 않았습니다</span>
        </div>
      )
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">Extension 상태 확인</h3>
      
      <div className="flex justify-center">
        {getExtensionStatusDisplay()}
      </div>
      
      {!extensionStatus && (
        <div className="flex justify-center">
          <Button 
            onClick={checkExtension}
            disabled={isChecking}
            className="px-8 py-2"
          >
            {isChecking ? '확인 중...' : '익스텐션 설치 확인'}
          </Button>
        </div>
      )}
      
      {extensionStatus && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={onNext} 
            disabled={!extensionStatus?.installed}
            className="px-8 py-2"
          >
            다음 단계로
          </Button>
        </div>
      )}
    </div>
  )
}