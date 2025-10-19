import type { ConnectWorkspaceResponseDto } from "scordi-extension";

interface WorkspaceResultPanelProps {
  result: {
    result?: ConnectWorkspaceResponseDto & {rawData: any};
    error?: string;
  };
}

export const WorkspaceResultPanel = ({ result }: WorkspaceResultPanelProps) => {
  const hasError = result.error || !result.result?.isSuccess;
  const workspaces = result.result?.data || [];

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
        <span>Workspaces</span>
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
            {workspaces.length}
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
          <div>{result.error || "Failed to fetch workspaces"}</div>
        </div>
      ) : workspaces.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          No workspaces found
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {workspaces.map((workspace, index) => (
            <div
              key={workspace.key || index}
              style={{
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "all 0.2s",
                cursor: "pointer",
                background: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              {workspace.image && (
                <img
                  src={workspace.image}
                  alt={workspace.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
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
                  {workspace.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    fontFamily: "monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {workspace.key}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Raw JSON Toggle (for debugging) */}
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
