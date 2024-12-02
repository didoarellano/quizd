import { Markdown } from "@/components/Markdown";

export function Option({
  text,
  isActive = false,
  onClick,
}: {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      style={{
        padding: "10px 20px",
        border: "1px solid #333",
        cursor: onClick ? "pointer" : "default",
        backgroundColor: isActive ? "pink" : "",
      }}
      onClick={onClick ? onClick : undefined}
    >
      <Markdown>{text}</Markdown>
    </div>
  );
}
