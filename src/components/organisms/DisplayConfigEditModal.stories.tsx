import { Story } from "@storybook/react";
import { CONST_STORY_BOOK, TestAuthProvider } from "../../test-utils";
import {
  DisplayConfigEditModal,
  DisplayConfigEditModalProps,
} from "./DisplayConfigEditModal";

export default {
  component: DisplayConfigEditModal,
  title: "DisplayConfigEditModal",
};

const Template: Story<DisplayConfigEditModalProps> = (args) => (
  <TestAuthProvider>
    <DisplayConfigEditModal {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
