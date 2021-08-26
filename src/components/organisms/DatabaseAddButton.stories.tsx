import { Story } from "@storybook/react";
import { DatabaseAddButton, DatabaseAddButtonProps } from "./DatabaseAddButton";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: DatabaseAddButton,
  title: "DatabaseAddButton",
};

const Template: Story<DatabaseAddButtonProps> = (args) => (
  <TestAuthProvider>
    <DatabaseAddButton {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
