interface BillingHistoryResultPanelProps {
  result: {
    result?: {
      data?: {
      uid: string;
      issuedDate: Date;
      paidDate: Date | null;
      paymentMethod: string;
      amount: {
        text: string;
        code: string;
        symbol: string;
        format: string;
        amount: number;
      };
      isSuccessfulPaid: boolean;
      receiptUrl: string;
      }[];
      rawData?: any;
    };
    error?: string;
  };
}

export const BillingHistoryResultPanel = ({ result }: BillingHistoryResultPanelProps) => {
  const hasError = result.error;
  const histories = result.result?.data || [];

  console.log(histories);

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
        <span>📊 Billing History</span>
        {!hasError && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "#6b7280",
              background: "#f3f4f6",
              padding: "2px 8px",
              borderRadius: 12,
            }}
          >
            {histories.length}
          </span>
        )}
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
          <div>{result.error || "Failed to fetch billing history"}</div>
        </div>
      ) : histories.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          No billing history found
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {histories.map((history: any, index: number) => (
            <div
              key={history.uid || index}
              style={{
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: 8,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#111827",
                      marginBottom: 4,
                    }}
                  >
                    {history.uid || "Payment"}
                  </div>
                  {history.issuedDate && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                      }}
                    >
                      {new Date(history.issuedDate).toLocaleDateString('ko-KR')}
                    </div>
                  )}
                </div>
                {history.amount && (
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: history.isSuccessfulPaid ? "#059669" : "#dc2626",
                      textAlign: "right",
                    }}
                  >
                    {history.amount.text}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                {history.isSuccessfulPaid !== undefined && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: history.isSuccessfulPaid ? "#059669" : "#dc2626",
                      background: history.isSuccessfulPaid ? "#d1fae5" : "#fee2e2",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {history.isSuccessfulPaid ? "Paid" : "Unpaid"}
                  </span>
                )}
                {history.paymentMethod && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                      background: "#f3f4f6",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {history.paymentMethod}
                  </span>
                )}
                {history.paidDate && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                      background: "#f3f4f6",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    Paid: {new Date(history.paidDate).toLocaleDateString('ko-KR')}
                  </span>
                )}
                {history.receiptUrl && (
                  <a
                    href={history.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 11,
                      color: "#2563eb",
                      background: "#eff6ff",
                      padding: "2px 8px",
                      borderRadius: 4,
                      textDecoration: "none",
                    }}
                  >
                    📄 Receipt
                  </a>
                )}
              </div>
            </div>
          ))}
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
          {JSON.stringify(result.result, null, 2)}
        </pre>
      </details>
    </div>
  );
};
