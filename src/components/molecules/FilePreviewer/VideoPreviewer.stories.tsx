import { Story } from "@storybook/react";
import { VideoPreviewer, VideoPreviewerProps } from "./VideoPreviewer";
import { CONST_STORY_BOOK } from "test-utils";

export default {
  component: VideoPreviewer,
  title: "FilePreview/VideoPreviewer",
};

const Template: Story<VideoPreviewerProps> = (args) => (
  <VideoPreviewer {...args} />
);
export const Default = Template.bind({});
Default.args = {
  url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
