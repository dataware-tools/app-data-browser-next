import { SpecType } from "components/molecules/Preview/types";
import ReactPlayer from "react-player";

const spec: SpecType = {
  extensions: [".mp4"],
  contentTypes: ["video/.*"],
};

const Container = (url: string): JSX.Element => {
  return <ReactPlayer url={url} controls width="100%" height="100%" />;
};

const containerWithSpec = {
  spec: spec,
  render: Container,
};

export {
  spec as videoPreviewSpec,
  Container as VideoPreview,
  containerWithSpec as videoPreviewWithSpec,
};
