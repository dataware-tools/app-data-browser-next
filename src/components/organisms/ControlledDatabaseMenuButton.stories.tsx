import { Story } from "@storybook/react";
import {
  ControlledDatabaseMenuButton,
  ControlledDatabaseMenuButtonProps,
} from "./ControlledDatabaseMenuButton";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: ControlledDatabaseMenuButton,
  title: "ControlledDatabaseMenuButton",
};

const Template: Story<ControlledDatabaseMenuButtonProps> = (args) => (
  <TestAuthProvider>
    <ControlledDatabaseMenuButton {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = {
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
