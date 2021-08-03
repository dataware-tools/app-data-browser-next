import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

type TextPreviewerProps = { url: string };
export const TextPreviewer = ({ url }: TextPreviewerProps): JSX.Element => {
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

  return (
    <TextField
      InputProps={{
        readOnly: true,
      }}
      multiline
      value={content}
      fullWidth
    />
  );
};
