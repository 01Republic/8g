import { CenteredSection } from "~/components/ui/centered-section";
import { LoadingCard } from "~/components/ui/loading-card";
import { LoaderCircleIcon, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useWorkflowExecution } from "~/hooks/use-workflow-execution";
import { setSectionResult } from "~/models/integration/SectionResultManager";
import { useEffect, useMemo } from "react";
import type { PaymentHistory } from "~/models/integration/types";
import { IntegrationSectionContentBox } from "./IntegrationSectionContentBox";
import { generateVariablesFromSectionResults } from "~/models/integration/VariableGenerator";

interface PaymentHistorySectionProps {
  title: string;
  workflow: any;
  onPaymentHistoryChange: (v: PaymentHistory[]) => void;
  paymentHistory: PaymentHistory[];
  onNext: (rows: any[]) => void;
  onPrevious?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function PaymentHistorySection({
  title,
  workflow,
  onPaymentHistoryChange,
  paymentHistory,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: PaymentHistorySectionProps) {
  const variables = useMemo(() => {
    return generateVariablesFromSectionResults();
  }, []);

  const { loading, error, parsed, run } = useWorkflowExecution(workflow, variables);

  useEffect(() => {
    if (!Array.isArray(parsed)) return;
    console.log('Payment History:', parsed);
    onPaymentHistoryChange(parsed);
    setSectionResult("payment-history", { result: parsed });
  }, [parsed]);

  return (
    <IntegrationSectionContentBox
      title={title}
      buttonText={
        !Array.isArray(parsed) || parsed.length === 0 ? "데이터 수집" : ""
      }
      onClick={run}
      isLoading={loading}
      hasPrevious={hasPrevious}
      onPrevious={onPrevious}
      hasNext={hasNext}
      onNext={() => {
        setSectionResult("payment-history", { result: paymentHistory });
        onNext(paymentHistory);
      }}
      isNextDisabled={!paymentHistory.length}
    >
      {!Array.isArray(parsed) || parsed.length === 0 ? (
        <CenteredSection className="space-y-4">
          <LoadingCard
            icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />}
            message={loading ? "결제 내역 수집 중..." : error || "결제 내역 수집 준비됨"}
          />
        </CenteredSection>
      ) : (
        <section className="mt-4 border rounded-lg max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0">
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>결제 일자</TableHead>
                <TableHead className="text-right">금액</TableHead>
                <TableHead className="w-24 text-center">인보이스</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((history: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="text-sm">
                    {history.date ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-right font-semibold">
                    {history.amount ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {history.invoiceUrl ? (
                      <a
                        href={history.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        링크
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </IntegrationSectionContentBox>
  );
}

