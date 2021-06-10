import { FilePreviewerContent } from "./types";
import { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";

const Container: FilePreviewerContent = ({ url }) => {
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

export { Container as TextPreviewer };
