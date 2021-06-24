import { Story } from "@storybook/react";
import {
  DatabaseMenuButton,
  DatabaseMenuButtonProps,
} from "./DatabaseMenuButton";

export default {
  component: DatabaseMenuButton,
  title: "DatabaseMenuButton",
};

const Template: Story<DatabaseMenuButtonProps> = (args) => (
  <DatabaseMenuButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onMenuSelect: (target) => window.alert(`click ${target}!`),
};
