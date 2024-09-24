import { useState, type FormEvent } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

type QuizEditorProps = {
  handleSave: (mdText: string) => void;
  initialMDText: string;
};

export function QuizEditor({
  handleSave,
  initialMDText = "",
}: QuizEditorProps) {
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
        minHeight={480}
        style={{ backgroundColor: "#f5f5f5" }}
      />
      <button type="submit">Save</button>
    </form>
  );
}
