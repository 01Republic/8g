import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Trash2, Mail, Phone, Briefcase } from "lucide-react";
import type { TeamMembers } from "~/.server/db";
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
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";

interface MembersTableProps {
  members: TeamMembers[];
  onDeleteMember: (teamMemberId: number) => void;
  selectedMemberIds: number[];
  onSelectMember: (memberId: number) => void;
  onSelectAll: (selected: boolean) => void;
}

const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const MembersTable = ({ members, onDeleteMember, selectedMemberIds, onSelectMember, onSelectAll }: MembersTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMembers | null>(null);

  const allSelected = members.length > 0 && selectedMemberIds.length === members.length;
  const someSelected = selectedMemberIds.length > 0 && selectedMemberIds.length < members.length;

  const handleDeleteClick = (member: TeamMembers, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMember) {
      onDeleteMember(selectedMember.id);
      setDeleteDialogOpen(false);
      setSelectedMember(null);
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected || (someSelected ? "indeterminate" : false)}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                멤버
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                연락처
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                직책
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                구독 수
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                가입일
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  등록된 멤버가 없습니다. 새로운 멤버를 추가해주세요.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedMemberIds.includes(member.id)}
                      onCheckedChange={() => onSelectMember(member.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.profileImgUrl || undefined} alt={member.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        {member.email && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.phone ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {member.phone}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {member.jobName ? (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{member.jobName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {member.subscriptionCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(member.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(member, e)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>멤버 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 <strong>{selectedMember?.name}</strong> 멤버를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

