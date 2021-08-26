import { Story } from "@storybook/react";
import { FilePreviewer, FilePreviewerProps } from "./";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: FilePreviewer,
  title: "FilePreviewer",
};

const Template: Story<FilePreviewerProps> = (args) => (
  <TestAuthProvider>
    <FilePreviewer {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = {
  file: {
    path: `/opt/uploaded_data/database_${CONST_STORY_BOOK.DATABASE_ID}/record_${CONST_STORY_BOOK.RECORD_ID}/test.txt`,
  },
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };

export const FetchFailed = Template.bind({});
FetchFailed.args = {
  file: {
    path: "/unknown.unknown",
  },
};
FetchFailed.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};
