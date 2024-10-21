import { Markdown } from "./Markdown";

export function Option({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "10px 20px",
        border: "1px solid #333",
        cursor: "pointer",
      }}
    >
      <Markdown>{text}</Markdown>
    </div>
  );
}
