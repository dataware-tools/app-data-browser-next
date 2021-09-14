import { Story } from "@storybook/react";
import { DatabaseConfigModal, DatabaseConfigModalProps } from "./";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: DatabaseConfigModal,
  title: "DatabaseConfigModal/Default",
};

const Template: Story<DatabaseConfigModalProps> = (args) => (
  <TestAuthProvider>
    <DatabaseConfigModal {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
