interface MembersResultPanelProps {
  result: {
    result?: {
      isSuccess: boolean;
      data?: any[];
      rawData?: any;
    };
    error?: string;
  };
}

export const MembersResultPanel = ({ result }: MembersResultPanelProps) => {
  const hasError = result.error;
  const members = result.result?.data || [];

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
        <span>👥 Members</span>
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
            {members.length}
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
          <div>{result.error || "Failed to fetch members"}</div>
        </div>
      ) : members.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          No members found
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {members.map((member: any, index: number) => (
            <div
              key={member.id || index}
              style={{
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#fff",
              }}
            >
              {member.avatar && (
                <img
                  src={member.avatar}
                  alt={member.name || member.email}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#111827",
                    marginBottom: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {member.name || member.email}
                </div>
                {member.email && member.name && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.email}
                  </div>
                )}
                {member.role && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#059669",
                      background: "#d1fae5",
                      padding: "2px 6px",
                      borderRadius: 4,
                      marginTop: 4,
                      display: "inline-block",
                    }}
                  >
                    {member.role}
                  </span>
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
          {JSON.stringify(result.result?.rawData, null, 2)}
        </pre>
      </details>
    </div>
  );
};
