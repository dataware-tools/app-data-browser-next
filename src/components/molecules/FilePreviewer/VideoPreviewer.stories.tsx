import { VideoPreviewer } from "./VideoPreviewer";

export default {
  component: VideoPreviewer,
  title: "FilePreview/Video",
};

export const Video = (): JSX.Element => (
  <VideoPreviewer url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" />
);
