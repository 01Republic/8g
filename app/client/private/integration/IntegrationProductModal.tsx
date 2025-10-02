import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { Dispatch, SetStateAction } from "react";
import { DynamicFormBuilder } from "~/client/private/integration/DynamicFormBuilder";
import type { PaymentInfo, PaymentHistory, SelectedWorkspace } from "~/models/integration/types";
import type { SelectedMembers } from "~/models/integration/types";
import type { AppFormMetadata } from "~/models/integration/types";

interface IntegartionProductModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (payload: {
    workspace: SelectedWorkspace;
    members: SelectedMembers[];
    paymentInfo: PaymentInfo;
    paymentHistory: PaymentHistory[];
    productId: number;
  }) => void;
  meta: AppFormMetadata;
  productId: number;
}

export const IntegartionProductModal = ({
  open,
  setOpen,
  onSubmit,
  meta,
  productId,
}: IntegartionProductModalProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<SelectedWorkspace | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMembers[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

  const sectionProps = {
    currentSection,
    selectedWorkspace,
    paymentInfo,
    paymentHistory,
    onPaymentInfoChange: setPaymentInfo,
    onPaymentHistoryChange: setPaymentHistory,
    onSelectedWorkspaceChange: setSelectedWorkspace,
    selectedMembers,
    onSelectedMembersChange: setSelectedMembers,
    onSectionChange: setCurrentSection,
    onModalClose: () => {
      setSelectedWorkspace(null);
      setSelectedMembers([]);
      setPaymentInfo(null);
      setPaymentHistory([]);
      setCurrentSection(0);
      setOpen(false);
    },
    productId,
    onSubmit: () => {
      if (!selectedWorkspace || !paymentInfo) return;
      onSubmit({
        workspace: selectedWorkspace,
        members: selectedMembers,
        paymentInfo,
        paymentHistory,
        productId,
      });
    },
  };

  const formBuilder = DynamicFormBuilder({ meta });

  const view = formBuilder.buildStepper({
    props: sectionProps,
  });

  useEffect(() => {
    if (open) {
      setCurrentSection(1);
      setSelectedWorkspace(null);
      setSelectedMembers([]);
      setPaymentInfo(null);
      setPaymentHistory([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-4xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>SaaS 연동 설정</DialogTitle>
        </DialogHeader>
        {view}
      </DialogContent>
    </Dialog>
  );
};
