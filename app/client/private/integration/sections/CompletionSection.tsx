import { useEffect } from "react";
import { useConfetti } from "~/hooks/use-confetti";
import { Button } from "~/components/ui/button";
import { IntegrationSectionContentBox } from "./IntegrationSectionContentBox";

interface CompletionSectionProps {
  title: string;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onSubmit: () => void;
}

export const CompletionSection = ({
  title,
  hasPrevious,
  onPrevious,
  onSubmit,
}: CompletionSectionProps) => {
  const { triggerConfetti, confettiElement } = useConfetti();
  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);
  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <IntegrationSectionContentBox
      title={title}
      hasPrevious={hasPrevious}
      onPrevious={onPrevious}
    >
      {confettiElement}
    </IntegrationSectionContentBox>
  );
};
