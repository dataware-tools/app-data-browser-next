import { Story } from "@storybook/react";
import {
  FilePreviewModalComponent,
  FilePreviewModalComponentProps,
} from "./FilePreviewModal";

export default {
  component: FilePreviewModalComponent,
  title: "FilePreview/ModalComponent",
};

const Template: Story<FilePreviewModalComponentProps> = (args) => (
  <FilePreviewModalComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  downloadURL: "",
  file: {
    path: "",
  },
};

export const Text = Template.bind({});
Text.args = {
  downloadURL:
    "https://raw.githubusercontent.com/dataware-tools/pydtk/master/README.md",
  file: {
    path: "file.txt",
  },
};

export const Video = Template.bind({});
Video.args = {
  downloadURL:
    "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  file: {
    path:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  },
};
