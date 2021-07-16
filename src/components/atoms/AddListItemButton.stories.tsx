import { Story } from "@storybook/react";
import { AddListItemButton, AddListItemButtonProps } from "./AddListItemButton";

export default {
  component: AddListItemButton,
  title: "AddListItemButton",
};

const Template: Story<AddListItemButtonProps> = (args) => (
  <AddListItemButton {...args} />
);

export const Default = Template.bind({});
Default.args = { onClick: () => window.alert("click!") };
