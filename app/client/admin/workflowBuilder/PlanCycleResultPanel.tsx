interface PlanCycleResultPanelProps {
  result: {
    result?: {
      currentCycleBillAmount: {
        text: string;
        code: string;
        symbol: string;
        format: string;
        amount: number;
      };
      cycleTerm: "MONTHLY" | "YEARLY";
      isFreeTier: boolean;
      isPerUser: boolean;
      nextPaymentDue: string;
      paidMemberCount: number;
      planName: string;
      unitPrice: {
        text: string;
        code: string;
        symbol: string;
        format: string;
        amount: number;
      };
      rawData: {
        success: boolean;
        steps: any[];
        error: any;
        timestamp: string;
        targetUrl: string;
      };
    };
    error?: string;
  };
}

export const PlanCycleResultPanel = ({ result }: PlanCycleResultPanelProps) => {
  const hasError = result.error;
  const data = result.result;
  console.log(result.result);

  return (
    <div
      style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        width: 420,
        maxHeight: "60%",
        overflow: "auto",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>💳 Plan & Cycle</span>
      </div>

      {hasError ? (
        <div
          style={{
            padding: 12,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 6,
            color: "#dc2626",
            fontSize: 14,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Error</div>
          <div>{result.error || "Failed to fetch plan and cycle"}</div>
        </div>
      ) : !data ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          No plan information found
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Plan Information */}
          {data.planName && (
            <div
              style={{
                padding: 16,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#f9fafb",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Plan
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                {data.planName || "Unknown Plan"}
              </div>
              {data.unitPrice.amount && (
                <div
                  style={{
                    fontSize: 14,
                    color: "#059669",
                    fontWeight: 500,
                  }}
                >
                  {data.unitPrice.amount}
                </div>
              )}
            </div>
          )}

          {/* Cycle Information */}
          {data.cycleTerm && (
            <div
              style={{
                padding: 16,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Billing Cycle
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {data.nextPaymentDue && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Next Payment Due:</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                      {data.nextPaymentDue}
                    </span>
                  </div>
                )}
                {data.cycleTerm && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Cycle Term:</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                      {data.cycleTerm === "MONTHLY" ? "Monthly" : "Yearly"}
                    </span>
                  </div>
                )}
                {data.isFreeTier !== undefined && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Free Tier:</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                      {data.isFreeTier ? "Yes" : "No"}
                    </span>
                  </div>
                )}
                {data.isPerUser !== undefined && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Per User:</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                      {data.isPerUser ? "Yes" : "No"}
                    </span>
                  </div>
                )}
                {data.paidMemberCount !== undefined && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Paid Member Count:</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                      {data.paidMemberCount}
                    </span>
                  </div>
                )}
                {data.currentCycleBillAmount.amount !== undefined && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Current Cycle Bill Amount:</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                      {data.currentCycleBillAmount.amount}
                    </span>
                  </div>
                )}
                {data.unitPrice.amount !== undefined && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Unit Price:</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                      {data.unitPrice.amount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <details style={{ marginTop: 12 }}>
        <summary
          style={{
            cursor: "pointer",
            fontSize: 12,
            color: "#6b7280",
            padding: "4px 0",
          }}
        >
          View Raw Data
        </summary>
        <pre
          style={{
            margin: "8px 0 0 0",
            fontSize: 11,
            lineHeight: 1.4,
            background: "#f9fafb",
            padding: 8,
            borderRadius: 4,
            overflow: "auto",
            maxHeight: 200,
          }}
        >
          {JSON.stringify(result.result?.rawData, null, 2)}
        </pre>
      </details>
    </div>
  );
};
