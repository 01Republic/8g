import { Button } from "~/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { LoaderCircleIcon } from "lucide-react"
import type { SlackWorkspace } from "~/models/integration/hook/use-slack-integration"

interface WorkspaceSelectionStepProps {
  workspaces: SlackWorkspace[]
  isCollectingWorkspaces: boolean
  selectedItem: string
  onSelectedItemChange: (value: string) => void
  onCollectWorkspaces: () => void
  onPrevious: () => void
  onNext: () => void
}

export function WorkspaceSelectionStep({
  workspaces,
  isCollectingWorkspaces,
  selectedItem,
  onSelectedItemChange,
  onCollectWorkspaces,
  onPrevious,
  onNext
}: WorkspaceSelectionStepProps) {
  return (
    <div className="space-y-4 max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">워크스페이스 선택</h3>
      
      {workspaces.length === 0 ? (
        <div className="flex justify-center">
          <Button 
            onClick={onCollectWorkspaces}
            disabled={isCollectingWorkspaces}
            className="px-8 py-2"
          >
            {isCollectingWorkspaces ? (
              <>
                <LoaderCircleIcon className="w-4 h-4 animate-spin mr-2" />
                수집 중...
              </>
            ) : (
              'Workspace 정보 수집'
            )}
          </Button>
        </div>
      ) : (
        <div>
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
          
          <div className="flex justify-between items-center mt-6">
            <Button 
              onClick={onPrevious} 
              variant="outline"
              className="px-6 py-2"
            >
              이전
            </Button>
            
            <Button 
              onClick={onNext} 
              disabled={!selectedItem}
              className="px-8 py-2"
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}