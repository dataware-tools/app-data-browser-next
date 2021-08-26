import { Story } from "@storybook/react";
import { FilePreviewModal, FilePreviewModalProps } from "./FilePreviewModal";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: FilePreviewModal,
  title: "FilePreview/Modal",
};

const Template: Story<FilePreviewModalProps> = (args) => (
  <TestAuthProvider>
    <FilePreviewModal {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = {
  open: true,
  onClose: () => {
    window.alert("Close");
  },
  file: {
    path:
      "/opt/uploaded_data/database_test1/record_20210714-055053-234/test.csv",
  },
  fileList: [
    {
      path:
        "/opt/uploaded_data/database_test1/record_20210714-055053-234/test.csv",
    },
  ],
  fullWidth: true,
  maxWidth: "lg",
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };

export const NoSuchFile = Template.bind({});
NoSuchFile.args = {
  open: true,
  onClose: () => {
    window.alert("Close");
  },
  file: {
    path: "/path/to/file",
  },
  fileList: [{ path: "/path/to/file" }],
  fullWidth: true,
  maxWidth: "lg",
};
NoSuchFile.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};
