import { useEffect } from "react";
import { CenteredSection } from "~/components/ui/centered-section";
import { LoadingCard } from "~/components/ui/loading-card";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useWorkflowExecution } from "~/hooks/use-workflow-execution";
import type { SelectedWorkspace } from "~/models/integration/types";

interface SelectBoxSectionProps {
  title: string;
  workflow: any;
  placeholder: string;
  selectedWorkspace: SelectedWorkspace | null;
  onSelectedWorkspaceChange: (v: SelectedWorkspace) => void;
  onNext: () => void;
  onParsed?: (list: any[]) => void;
  onPrevious?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const SelectBoxSection = ({
  title,
  workflow,
  placeholder,
  selectedWorkspace,
  onSelectedWorkspaceChange,
  onNext,
  onParsed,
  onPrevious,
  hasPrevious,
  hasNext,
}: SelectBoxSectionProps) => {
  const { loading, error, parsed, run } = useWorkflowExecution(workflow);

  useEffect(() => {
    if (Array.isArray(parsed) && onParsed) {
      onParsed(parsed);
    }
  }, [parsed, onParsed]);

  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <CenteredSection>
        {loading && (
          <LoadingCard
            message="데이터 수집 중..."
            icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />}
          />
        )}
        {!loading && error && (
          <LoadingCard
            icon={<span className="text-lg">❌</span>}
            message={error}
          />
        )}
      </CenteredSection>

      <div className="flex justify-end">
        <Button
          onClick={() => run()}
          disabled={loading}
          variant="outline"
          className="px-6 py-2"
        >
          데이터 수집
        </Button>
      </div>

      {!loading && Array.isArray(parsed) && parsed.length > 0 && (
        <div className="space-y-4">
          <Select
            value={selectedWorkspace?.elementId ?? undefined}
            onValueChange={(value) => {
              const list = (parsed as SelectedWorkspace[]) || [];
              const found = list.find((i) => i?.elementId === value);
              if (found) {
                onSelectedWorkspaceChange({
                  elementId: found.elementId,
                  elementText: found.elementText,
                });
              }
            }}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder={placeholder || "항목을 선택하세요"} />
            </SelectTrigger>
            <SelectContent>
              {(parsed as SelectedWorkspace[])
                .filter((item) => !!item?.elementId)
                .map((item) => {
                  const label = (item.elementText || item.elementId) as string;
                  return (
                    <SelectItem key={item.elementId} value={item.elementId}>
                      {label}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <div>
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
        <div>
          {hasNext && (
            <Button
              onClick={onNext}
              disabled={!selectedWorkspace?.elementId}
              className="px-8 py-2"
            >
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
