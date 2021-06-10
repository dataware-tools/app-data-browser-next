import { FilePreviewerContent } from "./types";
import ReactPlayer from "react-player";

const Container: FilePreviewerContent = ({ url }) => {
  return <ReactPlayer url={url} controls width="100%" height="100%" />;
};
export { Container as VideoPreviewer };
