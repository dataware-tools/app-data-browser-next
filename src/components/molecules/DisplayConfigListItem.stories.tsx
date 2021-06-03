import { Story } from "@storybook/react";
import {
  ActionType,
  DisplayConfigListItem,
  DisplayConfigListItemProps,
} from "./DisplayConfigListItem";

export default {
  component: DisplayConfigListItem,
  title: "DisplayConfigListItem",
};

const Template: Story<DisplayConfigListItemProps> = (args) => (
  <DisplayConfigListItem {...args} />
);

export const Default = Template.bind({});
Default.args = {
  value: "test1",
  options: [
    { label: "Test1", value: "test1" },
    { label: "Test2", value: "test2" },
    { label: "Test3", value: "test3" },
  ],
  alreadySelectedOptions: ["test1", "test2"],
  onChange: (action: ActionType, newValue: string, oldValue: string) =>
    window.alert(`${action}! "${oldValue}" -> "${newValue}"`),
};
