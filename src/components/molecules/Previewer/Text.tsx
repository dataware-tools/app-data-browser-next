import { SpecType } from "./types";
import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";

const spec: SpecType = {
  extensions: [".txt", ".md"],
  contentTypes: ["text/.*"],
};

const Container = (url: string): JSX.Element => {
  const [content, setContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(url)
      .then((resp) => {
        return resp.text();
      })
      .then((text) => {
        setContent(text);
      });
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

const containerWithSpec = {
  spec: spec,
  render: Container,
};

export {
  spec as textPreviewSpec,
  Container as TextPreview,
  containerWithSpec as textPreviewWithSpec,
};
