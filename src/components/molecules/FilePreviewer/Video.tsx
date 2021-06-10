import { SpecType, ContainerProps, ContainerWithSpecType } from "./types";
import ReactPlayer from "react-player";

const spec: SpecType = {
  extensions: [".mp4"],
  contentTypes: ["video/.*"],
};

const Container = (props: ContainerProps): JSX.Element => {
  return <ReactPlayer url={props.url} controls width="100%" height="100%" />;
};

const containerWithSpec: ContainerWithSpecType = {
  spec: spec,
  render: Container,
};

export {
  spec as videoPreviewerSpec,
  Container as VideoPreviewer,
  containerWithSpec as videoPreviewerWithSpec,
};
