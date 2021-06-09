import { SpecType } from "./types";
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
  container: Container,
};

export { spec, Container };

export default containerWithSpec;
