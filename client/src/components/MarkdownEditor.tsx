import { Button } from "@/components/ui/button";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, type FormEvent } from "react";

type MarkdownEditorProps = {
  handleSave: (mdText: string) => void;
  initialMDText: string;
};

export function MarkdownEditor({
  handleSave,
  initialMDText = "",
}: MarkdownEditorProps) {
  const [mdText, setMDText] = useState(initialMDText);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSave(mdText);
  }

  return (
    <form onSubmit={handleSubmit}>
      <CodeEditor
        value={mdText}
        onChange={(e) => setMDText(e.target.value)}
        language="md"
        className="font-mono text-[length:inherit]"
      />
      <Button type="submit">Save</Button>
    </form>
  );
}
