import {
  DynamicFormBuilder,
  type FormComponentProps,
} from "~/client/private/integration/DynamicFormBuilder";
import type { AppFormMetadata } from "~/models/integration/types";

interface FormPreviewProps {
  meta: AppFormMetadata;
  currentSection: number;
  selectedItem: string;
  onSelectedItemChange: (value: string) => void;
  onSectionChange: (index: number) => void;
}

export const FormPreview = (props: FormPreviewProps) => {
  const {
    meta,
    currentSection,
    selectedItem,
    onSelectedItemChange,
    onSectionChange,
  } = props;

  // 프리뷰에서 필요하지 않은 함수들
  const onModalClose = () => {};
  const productId = 0;
  const onSubmit = () => Promise.resolve();
  const selectedWorkspace = null as unknown;
  const selectedMembers = [] as unknown[];
  const onSelectedWorkspaceChange = (_w: unknown) => {};
  const onSelectedMembersChange = (_members: unknown[]) => {};

  const sectionProps = {
    currentSection,
    selectedItem,
    onSelectedItemChange,
    onSectionChange,
    onModalClose,
    productId,
    onSubmit,
    selectedWorkspace,
    selectedMembers,
    onSelectedWorkspaceChange,
    onSelectedMembersChange,
  } as FormComponentProps;

  const hasSections = meta.sections.length > 0;
  const formBuilder = DynamicFormBuilder({ meta });
  const preview = hasSections
    ? formBuilder.buildStepper({ props: sectionProps })
    : null;

  return (
    <div className="flex-1 w-full">
      <div className="bg-background rounded-lg border p-6 shadow-lg w-full max-w-[90vw] sm:max-w-4xl lg:max-w-4xl">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="text-lg leading-none font-semibold">
              SaaS 연동 설정
            </div>
          </div>
          <>{preview}</>
        </div>
      </div>
    </div>
  );
};
