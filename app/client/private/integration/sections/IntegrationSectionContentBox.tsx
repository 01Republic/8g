import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { CenteredSection } from "~/components/ui/centered-section";

interface IntegrationSectionContentBoxProps {
  title: string;
  children?: ReactNode;

  //   확인버튼
  buttonText?: string;
  onClick?: () => Promise<void>;
  isLoading?: boolean;

  // 이전 버튼
  hasPrevious?: boolean;
  onPrevious?: () => void;

  // 다음 버튼
  hasNext?: boolean;
  onNext?: () => void;
  isNextDisabled?: boolean;
}

export const IntegrationSectionContentBox = (
  props: IntegrationSectionContentBoxProps,
) => {
  const { title, children } = props;
  const { buttonText, onClick, isLoading } = props;
  const { hasPrevious = false, onPrevious } = props;
  const { hasNext = false, onNext, isNextDisabled } = props;

  return (
    <div className="max-w-md mx-auto w-full flex justify-between flex-col h-full">
      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-center">{title}</h3>
        {children && <CenteredSection>{children}</CenteredSection>}

        {buttonText && (
          <Button
            onClick={onClick}
            disabled={isLoading}
            variant="outline"
            className="px-8 py-2 w-full"
          >
            {buttonText}
          </Button>
        )}
      </section>

      <section className="flex justify-between">
        <div className="shrink-0">
          {hasPrevious && (
            <Button
              onClick={onPrevious}
              variant="outline"
              className="px-6 py-2"
            >
              이전
            </Button>
          )}
        </div>

        {hasNext && (
          <div className="flex items-center gap-2">
            <Button
              onClick={onNext}
              disabled={isNextDisabled}
              className="px-8 py-2"
            >
              다음
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
