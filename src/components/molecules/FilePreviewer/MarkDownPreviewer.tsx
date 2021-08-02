import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type MarkdownPreviewerProps = { url: string };
export const MarkdownPreviewer = ({
  url,
}: MarkdownPreviewerProps): JSX.Element | null => {
  const [content, setContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(url)
      .then((resp) => {
        return resp.text();
      })
      .then((text) => {
        setContent(text);
      });
  }, [url]);

  return content ? <ReactMarkdown>{content}</ReactMarkdown> : null;
};
