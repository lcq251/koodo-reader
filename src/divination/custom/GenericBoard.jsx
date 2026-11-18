export default function GenericBoard({ result }) {
  if (!result) return null;
  const summary =
    typeof result.summary === "string"
      ? result.summary
      : JSON.stringify(result, null, 2);
  return (
    <div className="board-col">
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: "14px",
          lineHeight: "1.6",
          padding: "16px",
          background: "var(--paper-3)",
          border: "1px solid var(--line)",
          borderRadius: "12px",
        }}
      >
        {summary}
      </pre>
    </div>
  );
}
