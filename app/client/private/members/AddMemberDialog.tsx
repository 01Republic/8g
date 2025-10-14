import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { TeamMemberAddPayload } from "./MembersPage";
import { CustomModal } from "~/components/CustomModal";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (payload: TeamMemberAddPayload) => void;
}

const FORM_ID = "add-member-form";

export const AddMemberDialog = ({
  open,
  onOpenChange,
  onAddMember,
}: AddMemberDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddMember({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.jobName,
      subscriptionCount: 0,
    });

    // 폼 초기화 및 다이얼로그 닫기
    setFormData({
      name: "",
      email: "",
      phone: "",
      jobName: "",
    });
    onOpenChange(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <CustomModal
      onOpen={open}
      onClose={() => onOpenChange(false)}
      title="새 멤버 추가"
      subTitle="팀에 새로운 멤버를 추가합니다. 필수 정보를 입력해주세요."
      buttonText="추가하기"
      formId={FORM_ID}
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
              placeholder="홍길동"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              이메일
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
              placeholder="example@company.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              전화번호
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="col-span-3"
              placeholder="010-1234-5678"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobName" className="text-right">
              직책
            </Label>
            <Input
              id="jobName"
              name="jobName"
              value={formData.jobName}
              onChange={handleChange}
              className="col-span-3"
              placeholder="개발자, 디자이너 등"
            />
          </div>
        </div>
      </form>
    </CustomModal>
  );
};
