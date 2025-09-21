import { Button } from "~/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import type { SlackWorkspace } from "~/models/integration/apps/slack/types"
import { useEffect, useRef } from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { LoadingCard } from "~/components/ui/loading-card"
import { CenteredSection } from "~/components/ui/centered-section"
import { LoaderCircleIcon } from "lucide-react"

interface WorkspaceSelectionStepProps {
  selectedItem: string
  onSelectedItemChange: (value: string) => void
  onPrevious: () => void
  onNext: () => void
  workspaces: SlackWorkspace[]
  isCollectingWorkspaces: boolean
  onCollectWorkspaces: () => void
}

export function WorkspaceSelectionStep({
  selectedItem,
  onSelectedItemChange,
  onPrevious,
  onNext,
  workspaces,
  isCollectingWorkspaces,
  onCollectWorkspaces
}: WorkspaceSelectionStepProps) {
  const hasRequestedRef = useRef(false)
  const autoNextTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (hasRequestedRef.current) return
    hasRequestedRef.current = true
    // 스텝2 진입 시마다 강제 수집
    onCollectWorkspaces()
  }, [onCollectWorkspaces])

  // 선택 시 자동 다음 스텝으로 이동 (부드러운 전환을 위해 약간의 지연)
  useEffect(() => {
    if (!selectedItem) return
    if (autoNextTimerRef.current) window.clearTimeout(autoNextTimerRef.current)
    autoNextTimerRef.current = window.setTimeout(() => {
      onNext()
    }, 600)
    return () => {
      if (autoNextTimerRef.current) window.clearTimeout(autoNextTimerRef.current)
    }
  }, [selectedItem, onNext])
  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">워크스페이스 선택</h3>
      
      {isCollectingWorkspaces && (
        <CenteredSection>
          <LoadingCard message="워크스페이스 수집 중..." icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} />
        </CenteredSection>
      )}

      {!isCollectingWorkspaces && workspaces.length > 0 && (
        <div className="space-y-4">
          <Select value={selectedItem} onValueChange={onSelectedItemChange}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Workspace를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((item, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {item.elementText} ({item.elementId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!isCollectingWorkspaces && workspaces.length === 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={onCollectWorkspaces}
            variant="outline"
            className="px-6 py-2"
          >
            재시도
          </Button>
        </div>
      )}
    </div>
  )
}