import ReactPlayer from "react-player";

export type VideoPreviewerProps = { url: string };
export const VideoPreviewer = ({ url }: VideoPreviewerProps): JSX.Element => {
  return <ReactPlayer url={url} controls width="100%" height="100%" />;
};
