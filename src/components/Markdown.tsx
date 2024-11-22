import MD, { type Options as MDOptions } from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children, ...props }: MDOptions) {
  if (typeof children !== "string") {
    throw new Error("Markdown children must be a string");
  }

  const defaultOptions = {
    remarkPlugins: [remarkGfm],
  };

  const options = {
    ...defaultOptions,
    ...props,
    remarkPlugins: [
      ...defaultOptions.remarkPlugins,
      ...(props.remarkPlugins ?? []),
    ],
  };

  return <MD {...options}>{children}</MD>;
}
