import { Story } from "@storybook/react";
import {
  SecretConfigEditModal,
  SecretConfigEditModalProps,
} from "./SecretConfigEditModal";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: SecretConfigEditModal,
  title: "SecretConfigEditModal",
};

const Template: Story<SecretConfigEditModalProps> = (args) => (
  <TestAuthProvider>
    <SecretConfigEditModal {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
