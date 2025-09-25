export const ResultPanel = ({ result }: { result: any }) => {
  return (
    <div
      style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        width: 420,
        maxHeight: "50%",
        overflow: "auto",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        padding: 12,
      }}
    >
      <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.4 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
};
