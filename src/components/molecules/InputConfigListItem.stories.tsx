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
  onUpdate: (newValue, oldValue) =>
    window.alert(
      `${JSON.stringify(oldValue)} -> "${JSON.stringify(newValue)}"`
    ),
  onDelete: (oldValue) => {
    window.alert(`${JSON.stringify(oldValue)} is deleted`);
  },
  value: {
    name: "name",
    display_name: "display_name",
    necessity: "recommended" as const,
  },
};
