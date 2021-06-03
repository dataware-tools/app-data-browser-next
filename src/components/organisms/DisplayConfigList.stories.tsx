import { Story } from "@storybook/react";
import { DisplayConfigList, DisplayConfigListProps } from "./DisplayConfigList";
import List from "@material-ui/core/List";

export default {
  component: DisplayConfigList,
  title: "DisplayConfigList",
};

const Template: Story<DisplayConfigListProps> = (args) => (
  <List>
    <DisplayConfigList {...args} />
  </List>
);

export const Default = Template.bind({});
Default.args = {
  value: ["test1", "test2"],
  alreadySelectedOptions: ["test1", "test2"],
  onChange: (action, index, newValue, oldValue) =>
    window.alert(`${action} No.${index} "${oldValue}" -> "${newValue}"`),
  options: [
    { label: "Test1", value: "test1" },
    { label: "Test2", value: "test2" },
    { label: "Test3", value: "test3" },
    { label: "Test4", value: "test4" },
  ],
};
