import { LoaderCircleIcon } from "lucide-react"
import { CenteredSection } from "~/components/ui/centered-section"
import { LoadingCard } from "~/components/ui/loading-card"
import { Label } from "~/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { useEffect } from "react"
import { Button } from "~/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import type { NotionWorkspace, NotionMember } from "~/models/integration/apps/notion/types"

interface MemberSyncStepProps {
  selectedWorkspace: NotionWorkspace | null
  memberData: NotionMember[]
  isCollectingMembers: boolean
  onCollectMembers: () => void
  onNext: () => void
}

export function MemberSyncStep({
  selectedWorkspace,
  memberData,
  isCollectingMembers,
  onCollectMembers,
  onNext
}: MemberSyncStepProps) {
  useEffect(() => {
    if (!selectedWorkspace) return
    if (!isCollectingMembers && memberData.length === 0) {
      onCollectMembers()
    }
  }, [selectedWorkspace, isCollectingMembers, memberData.length, onCollectMembers])

  const handleConfirmNext = () => {
    if (!selectedWorkspace || memberData.length === 0) return
    onNext()
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">멤버 연동</h3>
      {memberData.length === 0 ? (
        <CenteredSection className="space-y-4">
          <LoadingCard 
            icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} 
            message={isCollectingMembers ? '멤버 수집 중...' : '멤버 수집 준비됨'} 
          />
          <div className="flex justify-end">
            {!isCollectingMembers && (
              <Button onClick={onCollectMembers} variant="outline" className="px-6 py-2">재시도</Button>
            )}
          </div>
        </CenteredSection>
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
                    <TableCell className="text-sm">{member.joinDate || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end items-center pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="px-8 py-2">완료하기</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>연동을 완료할까요?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="space-y-1">
                      <div>워크스페이스: {selectedWorkspace?.elementText}</div>
                      <div>멤버 수: {memberData.length}</div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmNext}>확인</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  )
}


