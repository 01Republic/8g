import { useState } from "react";
import type { TeamMembers } from "~/.server/db";
import { MembersTable } from "~/client/private/members/MembersTable";
import { AddMemberDialog } from "~/client/private/members/AddMemberDialog";
import { Button } from "~/components/ui/button";
import { UserPlus, Users } from "lucide-react";

export type TeamMemberAddPayload = {
  name: string;
  email: string;
  phone: string;
  position: string;
  subscriptionCount: number;
}

interface MembersPageProps {
  members: TeamMembers[];
  addMember: (payload: TeamMemberAddPayload) => void;
  deleteMember: (teamMemberId: number) => void;
}

export default function MembersPage(props: MembersPageProps) {
  const { members, addMember, deleteMember   } = props;
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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
                총 <span className="font-semibold text-gray-700">{members.length}명</span>의 멤버가 등록되어 있습니다
              </p>
            </div>
          </div>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            멤버 추가
          </Button>
        </div>

        <MembersTable members={members} onDeleteMember={deleteMember} />
        <AddMemberDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAddMember={addMember}
        />
      </div>
    </div>
  );
}

