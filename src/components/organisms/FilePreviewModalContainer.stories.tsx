import { Story } from "@storybook/react";
import { FilePreviewModal, FilePreviewModalProps } from "./FilePreviewModal";

export default {
  component: FilePreviewModal,
  title: "FilePreview/ModalContainer",
};

const Template: Story<FilePreviewModalProps> = (args) => (
  <FilePreviewModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
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
