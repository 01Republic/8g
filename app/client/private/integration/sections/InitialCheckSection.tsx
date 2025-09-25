import { useState } from "react";
import { EightGClient } from "8g-extension";
import { Button } from "~/components/ui/button";
import { CenteredSection } from "~/components/ui/centered-section";
import { LoadingCard } from "~/components/ui/loading-card";
import { LoaderCircleIcon } from "lucide-react";

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
    <div className="space-y-6 max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <CenteredSection>
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
      </CenteredSection>
      <Button
        onClick={run}
        disabled={loading}
        variant="outline"
        className="px-8 py-2"
      >
        {installed === null ? "확인하기" : "재시도"}
      </Button>
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
            <div className="flex items-center gap-2">
              <Button
                onClick={onNext}
                disabled={installed !== true}
                className="px-8 py-2"
              >
                다음
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
