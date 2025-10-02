import type { ReactNode } from "react";
import type { FormComponentProps } from "./DynamicFormBuilder";
import { WorkspaceSelectSection } from "./sections/WorkspaceSelectSection";
import { PermissionCheckSection } from "./sections/PermissionCheckSection";
import { MemberTableSection } from "./sections/MemberTableSection";
import { InitialCheckSection } from "./sections/InitialCheckSection";
import { CompletionSection } from "./sections/CompletionSection";
import type { PaymentInfo, PaymentInfoSectionSchema, PaymentHistory, PaymentHistorySectionSchema, SelectedWorkspace } from "~/models/integration/types";
import type { SelectedMembers } from "~/models/integration/types";
import type { AppFormMetadata } from "~/models/integration/types";
import type {
  FormSectionSchema,
  WorkspaceSelectSectionSchema,
  PermissionCheckSectionSchema,
  MemberTableSectionSchema,
} from "~/models/integration/types";
import { PaymentInfoSection } from "./sections/PaymentInfoSection";
import { PaymentHistorySection } from "./sections/PaymentHistorySection";

export const buildSections = (
  meta: AppFormMetadata,
  props: FormComponentProps,
): ReactNode[] => {
  return meta.sections.map((sectionMeta, index) => {
    const sectionIndex = index + 1;
    const uiSchema = sectionMeta.uiSchema;
    const sectionCount = meta.sections.length;
    const hasPrevious = sectionIndex > 1;
    const hasNext = sectionIndex < sectionCount;

    const goNext = () => props.onSectionChange(sectionIndex + 1);
    const goPrev = () => props.onSectionChange(sectionIndex - 1);

    return buildSection(
      uiSchema,
      goNext,
      goPrev,
      props.onSubmit,
      props.onSelectedWorkspaceChange,
      props.selectedWorkspace,
      props.onSelectedMembersChange,
      props.selectedMembers,
      props.onPaymentInfoChange,
      props.paymentInfo,
      props.onPaymentHistoryChange,
      props.paymentHistory,
      sectionIndex,
      hasPrevious,
      hasNext,
    );
  });
};

export const buildSection = (
  uiSchema: FormSectionSchema,
  onNext: () => void,
  onPrevious: () => void,
  onSubmit: () => void,
  onSelectedWorkspaceChange: (v: SelectedWorkspace) => void,
  selectedWorkspace: SelectedWorkspace | null,
  onSelectedMembersChange: (v: SelectedMembers[]) => void,
  selectedMembers: SelectedMembers[],
  onPaymentInfoChange: (v: PaymentInfo | null) => void,
  paymentInfo: PaymentInfo | null,
  onPaymentHistoryChange: (v: PaymentHistory[]) => void,
  paymentHistory: PaymentHistory[],
  keyId: string | number,
  hasPrevious: boolean,
  hasNext: boolean,
) => {
  const uiType = uiSchema?.type;

  switch (uiType) {
    case "initial-check":
      return (
        <InitialCheckSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          onNext={onNext as () => void}
          onPrevious={onPrevious}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      );

    case "workspace-select":
      return (
        <WorkspaceSelectSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          workflow={(uiSchema as WorkspaceSelectSectionSchema).workflow}
          placeholder={(uiSchema as WorkspaceSelectSectionSchema).placeholder}
          selectedWorkspace={selectedWorkspace}
          onSelectedWorkspaceChange={onSelectedWorkspaceChange}
          onNext={onNext as () => void}
          onPrevious={onPrevious}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      );

    case "permission-check":
      return (
        <PermissionCheckSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          workflow={(uiSchema as PermissionCheckSectionSchema).workflow}
          loadingMessage={(uiSchema as PermissionCheckSectionSchema).loadingMessage}
          errorMessage={(uiSchema as PermissionCheckSectionSchema).errorMessage}
          successMessage={(uiSchema as PermissionCheckSectionSchema).successMessage}
          onPrevious={onPrevious}
          onNext={onNext as () => void}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      );

    case "member-table":
      return (
        <MemberTableSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          workflow={(uiSchema as MemberTableSectionSchema).workflow}
          onSelectedMembersChange={onSelectedMembersChange}
          selectedMembers={selectedMembers}
          onNext={onNext as (rows: any[]) => void}
          onPrevious={onPrevious}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      );

    case "payment-info":
      return (
        <PaymentInfoSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          workflow={(uiSchema as PaymentInfoSectionSchema).workflow}
          onPaymentInfoChange={onPaymentInfoChange}
          paymentInfo={paymentInfo}
          onNext={onNext as () => void}
          onPrevious={onPrevious}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      );

    case "payment-history":
      return (
        <PaymentHistorySection
          key={`section-${keyId}`}
          title={uiSchema.title}
          workflow={(uiSchema as PaymentHistorySectionSchema).workflow}
          onPaymentHistoryChange={onPaymentHistoryChange}
          paymentHistory={paymentHistory}
          onNext={onNext as (rows: any[]) => void}
          onPrevious={onPrevious}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      );

    case "completion":
      return (
        <CompletionSection
          key={`section-${keyId}`}
          title={uiSchema.title}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPrevious={onPrevious}
          onSubmit={onSubmit}
        />
      );

    default:
      return null;
  }
};
