import { Story } from "@storybook/react";
import { FilePreviewModal, FilePreviewModalProps } from "./FilePreviewModal";

export default {
  component: FilePreviewModal,
  title: "FilePreview/Modal",
};

const Template: Story<FilePreviewModalProps> = (args) => (
  <FilePreviewModal {...args} />
);

export const NoSuchFile = Template.bind({});
NoSuchFile.args = {
  open: true,
  onClose: () => {
    window.alert("Close");
  },
  file: {
    path: "/path/to/file",
  },
  fullWidth: true,
  maxWidth: "lg",
};

export const Text = Template.bind({});
Text.args = {
  open: true,
  onClose: () => {
    window.alert("Close");
  },
  file: {
    path: "/opt/app/README.md",
  },
  fullWidth: true,
  maxWidth: "lg",
};
