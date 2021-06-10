import { SpecType } from "./types";

const spec: SpecType = {
  extensions: [".*"],
  contentTypes: [".*"],
};

const Container = (url: string): JSX.Element => {
  return <div>Default Preview: {url}</div>;
};

const containerWithSpec = {
  spec: spec,
  render: Container,
};

export {
  spec as defaultPreviewSpec,
  Container as DefaultPreview,
  containerWithSpec as defaultPreviewWithSpec,
};