import { useState } from "react";
import { CustomModal } from "~/components/CustomModal";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type { TeamMemberResponseDto } from "~/routes/dto/member";

interface EditMemberModalProps {
  onOpen: boolean;
  onClose: () => void;

  // content
  member: TeamMemberResponseDto;
}

const FORM_ID = "edit-member-form";

export const EditMemberModal = (props: EditMemberModalProps) => {
  const { onOpen = false, onClose } = props;
  const { member } = props;

  const [formData, setFormData] = useState(member);

  return (
    <CustomModal
      onOpen={onOpen}
      onClose={onClose}
      title="멤버 정보 수정"
      subTitle={`${member.name} 멤버의 정보를 수정할 수 있습니다.`}
      buttonText="수정하기"
    >
      <></>
      {/* <form id={FORM_ID} onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
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
              onChange={(e) => setFormData({ email: e.target.value })}
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
              onChange={(e) => setFormData({ phone: e.target.value })}
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
              onChange={(e) => setFormData({ jobName: e.target.value })}
              className="col-span-3"
              placeholder="개발자, 디자이너 등"
            />
          </div>
        </div>
      </form> */}
    </CustomModal>
  );
};
