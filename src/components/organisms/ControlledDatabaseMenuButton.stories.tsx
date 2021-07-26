import { Story } from "@storybook/react";
import {
  ControlledDatabaseMenuButton,
  ControlledDatabaseMenuButtonProps,
} from "./ControlledDatabaseMenuButton";

export default {
  component: ControlledDatabaseMenuButton,
  title: "ControlledDatabaseMenuButton",
};

const Template: Story<ControlledDatabaseMenuButtonProps> = (args) => (
  <ControlledDatabaseMenuButton {...args} />
);

export const Default = Template.bind({});
Default.args = { databaseId: "default" };
