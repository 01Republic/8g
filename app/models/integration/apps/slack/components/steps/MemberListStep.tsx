import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { LoaderCircleIcon } from "lucide-react"
import type { SlackWorkspace, SlackMember } from "~/models/integration/apps/slack/types"

interface MemberListStepProps {
  selectedWorkspace: SlackWorkspace | null
  isAdmin: boolean | null
  isCheckingAdmin: boolean
  onCheckAdminPermission: () => void
  memberData: SlackMember[]
  isCollectingMembers: boolean
  onCollectMembers: () => void
  onPrevious: () => void
  onNext: () => void
}

export function MemberListStep({
  selectedWorkspace,
  isAdmin,
  isCheckingAdmin,
  onCheckAdminPermission,
  memberData,
  isCollectingMembers,
  onCollectMembers,
  onPrevious,
  onNext
}: MemberListStepProps) {
  const handleCheckAdminPermission = onCheckAdminPermission;
  const handleCollectMembers = onCollectMembers;
  
  return (
    <div className="space-y-4 w-full">
      <h3 className="text-lg font-semibold text-center">멤버 리스트 확인</h3>
      
      {isAdmin === null ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">먼저 워크스페이스 관리자 권한을 확인하세요.</p>
          <Button 
            onClick={handleCheckAdminPermission}
            disabled={isCheckingAdmin || !selectedWorkspace}
            className="px-8 py-2"
          >
            {isCheckingAdmin ? (
              <>
                <LoaderCircleIcon className="w-4 h-4 animate-spin mr-2" />
                권한 확인 중...
              </>
            ) : (
              '관리자 권한 확인'
            )}
          </Button>
        </div>
      ) : isAdmin === false ? (
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 justify-center">
              <span className="text-lg">❌</span>
              <span className="font-medium">권한 없음</span>
            </div>
            <p className="text-red-600 text-sm mt-2">
              워크스페이스 관리자만 멤버 리스트에 접근할 수 있습니다.
            </p>
          </div>
        </div>
      ) : memberData.length === 0 ? (
        <div className="text-center space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 justify-center">
              <span className="text-lg">✅</span>
              <span className="font-medium">관리자 권한 확인됨</span>
            </div>
          </div>
          <p className="text-gray-600">이제 멤버 데이터를 수집할 수 있습니다.</p>
          <Button 
            onClick={handleCollectMembers}
            disabled={isCollectingMembers}
            className="px-8 py-2"
          >
            {isCollectingMembers ? (
              <>
                <LoaderCircleIcon className="w-4 h-4 animate-spin mr-2" />
                멤버 수집 중...
              </>
            ) : (
              '멤버 데이터 수집'
            )}
          </Button>
        </div>
      ) : (
        <div>
          <Label>수집된 멤버 ({memberData.length}개):</Label>
          <div className="mt-4 border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberData.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="text-sm">{member.email}</TableCell>
                    <TableCell className="text-sm">{member.status}</TableCell>
                    <TableCell className="text-sm">{member.joinDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-4">
        <Button 
          onClick={onPrevious} 
          variant="outline"
          className="px-6 py-2"
        >
          이전
        </Button>
        {memberData.length > 0 && (
          <Button onClick={onNext} className="px-8 py-2">
            완료하기
          </Button>
        )}
      </div>
    </div>
  )
}