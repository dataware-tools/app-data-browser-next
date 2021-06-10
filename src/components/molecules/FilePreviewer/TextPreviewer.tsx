import { FilePreviewerContent } from "./types";
import { useState } from "react";
import { TextField } from "@material-ui/core";

const Container: FilePreviewerContent = ({ url }) => {
  const [content, setContent] = useState<string | undefined>(undefined);

  fetch(url)
    .then((resp) => {
      return resp.text();
    })
    .then((text) => {
      setContent(text);
    });

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
