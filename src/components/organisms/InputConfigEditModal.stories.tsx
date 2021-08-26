import { Story } from "@storybook/react";
import {
  InputConfigEditModal,
  InputConfigEditModalProps,
} from "./InputConfigEditModal";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: InputConfigEditModal,
  title: "InputConfigEditModal",
};

const Template: Story<InputConfigEditModalProps> = (args) => (
  <TestAuthProvider>
    <InputConfigEditModal {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
