interface FilePreviewerContent {
  (props: { url: string }): JSX.Element;
}

type FilePreviewerContentWithSpec = {
  spec: {
    extensions: string[];
    contentTypes: string[];
  };
  render: (url: string) => JSX.Element;
};

export type { FilePreviewerContent, FilePreviewerContentWithSpec };
