import { metaStore } from "@dataware-tools/api-meta-store-client";
import { useState, useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

const languages = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  json: "json",
  sh: "bash",
  yml: "yaml",
  yaml: "yaml",
};
export const extensions = Object.keys(languages);

type SourceCodePreviewerProps = { url: string; file: metaStore.FileModel };
export const SourceCodePreviewer = ({
  url,
  file,
}: SourceCodePreviewerProps): JSX.Element | null => {
  const [content, setContent] = useState<string | undefined>(undefined);
  const extension = file.path.split(".").splice(-1)[0];

  useEffect(() => {
    fetch(url)
      .then((resp) => {
        return resp.text();
      })
      .then((text) => {
        setContent(text);
      });
  }, [url]);

  return content ? (
    <SyntaxHighlighter language={languages[extension]}>
      {content}
    </SyntaxHighlighter>
  ) : null;
};
