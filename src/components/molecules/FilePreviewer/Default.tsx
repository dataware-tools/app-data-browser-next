import { SpecType, ContainerProps, ContainerWithSpecType } from "./types";

const spec: SpecType = {
  extensions: [".*"],
  contentTypes: [".*"],
};

const Container = (props: ContainerProps): JSX.Element => {
  return <div>Default Preview: {props.url}</div>;
};

const containerWithSpec: ContainerWithSpecType = {
  spec: spec,
  render: Container,
};

export {
  spec as defaultPreviewerSpec,
  Container as DefaultPreviewer,
  containerWithSpec as defaultPreviewerWithSpec,
};
