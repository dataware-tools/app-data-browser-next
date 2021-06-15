import { Story } from "@storybook/react";
import { FilePreviewer, FilePreviewerProps } from "./";

export default {
  component: FilePreviewer,
  title: "FilePreview",
};

const Template: Story<FilePreviewerProps> = (args) => (
  <FilePreviewer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  url: "",
  file: {
    path: "",
  },
};

export const Text = Template.bind({});
Text.args = {
  url:
    "https://raw.githubusercontent.com/dataware-tools/pydtk/master/README.md",
  file: {
    path: "file.txt",
  },
};

export const Video = Template.bind({});
Video.args = {
  url:
    "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  file: {
    path:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  },
};
