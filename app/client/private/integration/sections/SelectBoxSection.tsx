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
import { IntegrationSectionContentBox } from "./IntegrationSectionContentBox";

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
    <IntegrationSectionContentBox
      title={title}
      buttonText=" 데이터 수집"
      onClick={run}
      isLoading={loading}
      hasPrevious={hasPrevious}
      onPrevious={onPrevious}
      hasNext={hasNext}
      onNext={onNext}
      isNextDisabled={!selectedWorkspace?.elementId}
    >
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
    </IntegrationSectionContentBox>
  );
};
