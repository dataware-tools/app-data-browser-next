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
  file: {
    path: "",
  },
};

export const Text = Template.bind({});
Text.args = {
  file: {
    path:
      "/opt/uploaded_data/database_default/record_20210719-023706-793/test.txt",
  },
};
