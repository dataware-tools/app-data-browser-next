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
  onConfigure: () => {
    window.alert("configure");
  },
  onDelete: (oldValue) => {
    window.alert(`${JSON.stringify(oldValue)} is deleted`);
  },
  value: {
    name: "name",
    display_name: "display_name",
    necessity: "recommended" as const,
    is_secret: false,
    dtype: "string",
    aggregation: "first",
  },
};
