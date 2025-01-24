import { Button } from "@/components/ui/button";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, type FormEvent } from "react";

type MarkdownEditorProps = {
  formID: string;
  handleSave: (mdText: string) => void;
  hideSaveButton?: boolean;
  initialMDText: string;
};

export function MarkdownEditor({
  formID,
  handleSave,
  hideSaveButton = false,
  initialMDText = "",
}: MarkdownEditorProps) {
  const [mdText, setMDText] = useState(initialMDText);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSave(mdText);
  }

  return (
    <form onSubmit={handleSubmit} id={formID}>
      <CodeEditor
        value={mdText}
        onChange={(e) => setMDText(e.target.value)}
        language="md"
        autoFocus={true}
        className="font-mono text-[length:inherit]"
      />
      <Button className={hideSaveButton ? "sr-only" : ""} type="submit">
        Save
      </Button>
    </form>
  );
}
