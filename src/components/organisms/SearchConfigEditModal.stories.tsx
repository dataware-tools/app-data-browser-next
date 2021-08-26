import { Story } from "@storybook/react";
import {
  SearchConfigEditModal,
  SearchConfigEditModalProps,
} from "./SearchConfigEditModal";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: SearchConfigEditModal,
  title: "SearchConfigEditModal",
};

const Template: Story<SearchConfigEditModalProps> = (args) => (
  <TestAuthProvider>
    <SearchConfigEditModal {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
