import { Story } from "@storybook/react";
import { RecordInfo, RecordInfoProps } from "./RecordInfo";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: RecordInfo,
  title: "RecordInfo",
};

const Template: Story<RecordInfoProps> = (args) => (
  <TestAuthProvider>
    <RecordInfo {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = {
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  recordId: CONST_STORY_BOOK.RECORD_ID,
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
