import { RosbagPreviewer } from "./";

export default {
  component: RosbagPreviewer,
  title: "FilePreview/Rosbag",
};

export const Rosbag = (): JSX.Element => (
  <RosbagPreviewer filePath="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" />
);
