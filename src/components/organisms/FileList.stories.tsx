import { Story } from "@storybook/react";
import { FileList, FileListProps } from "./FileList";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: FileList,
  title: "FileList",
};

const Template: Story<FileListProps> = (args) => (
  <TestAuthProvider>
    <FileList {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = {
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  recordId: CONST_STORY_BOOK.RECORD_ID,
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
