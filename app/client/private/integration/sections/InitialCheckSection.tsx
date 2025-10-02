import { useState } from "react";
import { EightGClient } from "8g-extension";
import { Button } from "~/components/ui/button";
import { CenteredSection } from "~/components/ui/centered-section";
import { LoadingCard } from "~/components/ui/loading-card";
import { LoaderCircleIcon } from "lucide-react";
import { IntegrationSectionContentBox } from "./IntegrationSectionContentBox";

interface InitialCheckSectionProps {
  title: string;
  onNext: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
}

export const InitialCheckSection = ({
  title,
  onNext,
  hasPrevious,
  hasNext,
  onPrevious,
}: InitialCheckSectionProps) => {
  const [loading, setLoading] = useState(false);
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    try {
      setLoading(true);
      setError(null);
      const client = new EightGClient();
      const status = await client.checkExtension();
      const ok = !!(status as any)?.installed;
      setInstalled(ok);
    } catch (e: any) {
      setError(e?.message || "확인 실패");
    } finally {
      setLoading(false);
    }
  };

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
      isNextDisabled={installed !== true}
    >
      {loading && (
        <LoadingCard
          message="8G Extension 확인 중..."
          icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />}
        />
      )}
      {!loading && error && (
        <LoadingCard
          icon={<span className="text-lg">❌</span>}
          message={error}
        />
      )}
      {!loading && !error && installed === true && (
        <LoadingCard
          icon={<span className="text-lg">✅</span>}
          message="8G Extension 설치됨"
        />
      )}
      {!loading && !error && installed === false && (
        <LoadingCard
          icon={<span className="text-lg">❌</span>}
          message="8G Extension이 설치되지 않았습니다"
        />
      )}
    </IntegrationSectionContentBox>
  );
};
