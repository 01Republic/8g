import { useEffect } from "react";
import { useConfetti } from "~/hooks/use-confetti";
import { Button } from "~/components/ui/button";

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
    <>
      {confettiElement}
      <div className="space-y-4 max-w-md mx-auto w-full text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex justify-start pt-2">
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
      </div>
    </>
  );
};
