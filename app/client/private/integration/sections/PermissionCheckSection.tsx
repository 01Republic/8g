import { useEffect, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { CenteredSection } from "~/components/ui/centered-section";
import { LoadingCard } from "~/components/ui/loading-card";
import { LoaderCircleIcon } from "lucide-react";
import { useWorkflowExecution } from "~/hooks/use-workflow-execution";
import { setSectionResult } from "~/models/integration/SectionResultManager";
import { IntegrationSectionContentBox } from "./IntegrationSectionContentBox";
import { generateVariablesFromSectionResults } from "~/models/integration/VariableGenerator";

interface PermissionCheckSectionProps {
  title: string;
  workflow: any;
  loadingMessage: string;
  errorMessage: string;
  successMessage: string;
  targetUrl?: string;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const PermissionCheckSection = ({
  title,
  workflow,
  loadingMessage,
  errorMessage,
  successMessage,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: PermissionCheckSectionProps) => {
  const variables = useMemo(() => {
    return generateVariablesFromSectionResults();
  }, []);

  const { loading, error, parsed, run } = useWorkflowExecution(
    workflow,
    variables,
  );

  useEffect(() => {
    if (parsed === true) {
      setSectionResult("permission-check", { result: true });
    }
  }, [parsed]);

  return (
    <IntegrationSectionContentBox
      title={title}
      buttonText="권한 확인"
      onClick={run}
      isLoading={loading}
      hasPrevious={hasPrevious}
      onPrevious={onPrevious}
      hasNext={hasNext}
      onNext={onNext}
      isNextDisabled={parsed !== true}
    >
      {loading && (
        <LoadingCard
          icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />}
          message={loadingMessage}
        />
      )}
      {!loading && error && (
        <LoadingCard
          icon={<span className="text-lg">❌</span>}
          message={error}
        />
      )}
      {!loading && !error && parsed === false && (
        <LoadingCard
          icon={<span className="text-lg">❌</span>}
          message={errorMessage}
        />
      )}
      {!loading && !error && parsed === true && (
        <LoadingCard
          icon={<span className="text-lg">✅</span>}
          message={successMessage}
        />
      )}
    </IntegrationSectionContentBox>
  );
};
