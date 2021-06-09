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
  open: true,
  onClose: () => {
    window.alert("Close");
  },
  downloadURL: undefined,
  file: {
    path: "file.txt",
  },
  fullWidth: true,
  maxWidth: "lg",
};
