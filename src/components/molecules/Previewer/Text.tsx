import { SpecType, ContainerProps, ContainerWithSpecType } from "./types";
import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";

const spec: SpecType = {
  extensions: [".txt", ".md"],
  contentTypes: ["text/.*"],
};

const Container = (props: ContainerProps): JSX.Element => {
  const [content, setContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(props.url)
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

const containerWithSpec: ContainerWithSpecType = {
  spec: spec,
  render: Container,
};

export {
  spec as textPreviewerSpec,
  Container as TextPreviewer,
  containerWithSpec as textPreviewerWithSpec,
};
