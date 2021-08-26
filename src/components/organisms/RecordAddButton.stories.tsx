import { Story } from "@storybook/react";
import { RecordAddButton, RecordAddButtonProps } from "./RecordAddButton";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: RecordAddButton,
  title: "RecordAddButton",
};

const Template: Story<RecordAddButtonProps> = (args) => (
  <TestAuthProvider>
    <RecordAddButton {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
