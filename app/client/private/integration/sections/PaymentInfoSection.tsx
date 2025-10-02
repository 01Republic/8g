import { CenteredSection } from "~/components/ui/centered-section";
import { LoadingCard } from "~/components/ui/loading-card";
import { LoaderCircleIcon } from "lucide-react";
import { useWorkflowExecution } from "~/hooks/use-workflow-execution";
import { setSectionResult } from "~/models/integration/SectionResultManager";
import { useEffect, useMemo } from "react";
import type { PaymentInfo } from "~/models/integration/types";
import { IntegrationSectionContentBox } from "./IntegrationSectionContentBox";
import { generateVariablesFromSectionResults } from "~/models/integration/VariableGenerator";
import { Card } from "~/components/ui/card";

interface PaymentInfoSectionProps {
  title: string;
  workflow: any;
  onPaymentInfoChange: (v: PaymentInfo | null) => void;
  paymentInfo: PaymentInfo | null;
  onNext: () => void;
  onPrevious?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function PaymentInfoSection({
  title,
  workflow,
  onPaymentInfoChange,
  paymentInfo,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: PaymentInfoSectionProps) {
  const variables = useMemo(() => {
    return generateVariablesFromSectionResults();
  }, []);

  const { loading, error, parsed, run } = useWorkflowExecution(workflow, variables);

  useEffect(() => {
    if (!parsed) return;
    console.log('Payment Info:', parsed);
    onPaymentInfoChange(parsed as PaymentInfo);
    setSectionResult("payment-info", { result: parsed });
  }, [parsed]);

  return (
    <IntegrationSectionContentBox
      title={title}
      buttonText={!parsed ? "데이터 수집" : ""}
      onClick={run}
      isLoading={loading}
      hasPrevious={hasPrevious}
      onPrevious={onPrevious}
      hasNext={hasNext}
      onNext={() => {
        if (paymentInfo) {
          setSectionResult("payment-info", { result: paymentInfo });
        }
        onNext();
      }}
      isNextDisabled={!paymentInfo}
    >
      {!parsed ? (
        <CenteredSection className="space-y-4">
          <LoadingCard
            icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />}
            message={loading ? "결제 정보 수집 중..." : error || "결제 정보 수집 준비됨"}
          />
        </CenteredSection>
      ) : (
        <Card className="mt-4 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">카드 뒷 번호</div>
              <div className="text-sm font-medium">
                {paymentInfo?.lastFourDigits ? `**** ${paymentInfo.lastFourDigits}` : "N/A"}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">청구 이메일</div>
              <div className="text-sm font-medium">
                {paymentInfo?.billingEmail ?? "N/A"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">요금제</div>
              <div className="text-sm font-medium">
                {paymentInfo?.planName ?? "N/A"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">연간/월간</div>
              <div className="text-sm font-medium">
                {paymentInfo?.billingCycle ?? "N/A"}
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-xs text-gray-500 mb-1">가격</div>
              <div className="text-lg font-semibold text-primary">
                {paymentInfo?.price ?? "N/A"}
              </div>
            </div>
          </div>
        </Card>
      )}
    </IntegrationSectionContentBox>
  );
}

