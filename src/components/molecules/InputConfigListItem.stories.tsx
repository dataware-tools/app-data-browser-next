import { Story } from "@storybook/react";
import {
  InputConfigListItemProps,
  InputConfigListItem,
} from "./InputConfigListItem";

export default {
  component: InputConfigListItem,
  title: "InputConfigListItem",
};

const Template: Story<InputConfigListItemProps> = (args) => (
  <InputConfigListItem {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onChange: (action, value) =>
    window.alert(`${action} "${JSON.stringify(value)}"`),
  value: {
    name: "name",
    display_name: "display_name",
    necessity: "recommended" as const,
  },
};
