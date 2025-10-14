import { useState } from "react";
import { MembersTable } from "~/client/private/members/MembersTable";
import { AddMemberDialog } from "~/client/private/members/AddMemberDialog";
import { Button } from "~/components/ui/button";
import { UserPlus, Users, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import type { TeamMemberResponseDto } from "~/routes/dto/member";

export type TeamMemberAddPayload = {
  name: string;
  email: string;
  phone: string;
  position: string;
  subscriptionCount: number;
};

export type TeamMemberUpdatePayload = {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
};

interface MembersPageProps {
  members: TeamMemberResponseDto[];
  addMember: (payload: TeamMemberAddPayload) => void;
  updateMember: (payload: TeamMemberUpdatePayload) => void;
  deleteMember: (teamMemberId: number) => void;
  deleteAllMembers: (teamMemberIds: number[]) => void;
}

export default function MembersPage(props: MembersPageProps) {
  const { members, addMember, deleteMember, deleteAllMembers, updateMember } =
    props;
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  const handleSelectMember = (memberId: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedMemberIds(members.map((m) => m.id));
    } else {
      setSelectedMemberIds([]);
    }
  };

  const handleDeleteAll = () => {
    setDeleteAllDialogOpen(true);
  };

  const handleConfirmDeleteAll = () => {
    deleteAllMembers(selectedMemberIds);
    setSelectedMemberIds([]);
    setDeleteAllDialogOpen(false);
  };

  return (
    <div className="h-full w-full p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">팀 멤버 관리</h1>
              <p className="text-sm text-gray-500">
                총{" "}
                <span className="font-semibold text-gray-700">
                  {members.length}명
                </span>
                의 멤버가 등록되어 있습니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedMemberIds.length > 0 && (
              <Button
                onClick={handleDeleteAll}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                선택 삭제 ({selectedMemberIds.length})
              </Button>
            )}
            <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
              <UserPlus className="w-4 h-4" />
              멤버 추가
            </Button>
          </div>
        </div>

        <MembersTable
          members={members}
          onDeleteMember={deleteMember}
          selectedMemberIds={selectedMemberIds}
          onSelectMember={handleSelectMember}
          onSelectAll={handleSelectAll}
          updateMember={updateMember}
        />
        <AddMemberDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAddMember={addMember}
        />
        <AlertDialog
          open={deleteAllDialogOpen}
          onOpenChange={setDeleteAllDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>선택한 멤버 일괄 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 선택한 <strong>{selectedMemberIds.length}명</strong>의
                멤버를 삭제하시겠습니까?
                <br />이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDeleteAll}
                className="bg-red-600 hover:bg-red-700"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
