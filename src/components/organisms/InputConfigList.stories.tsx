import { Story } from "@storybook/react";
import { InputConfigList, InputConfigListProps } from "./InputConfigList";

export default {
  component: InputConfigList,
  title: "InputConfigList",
};

const Template: Story<InputConfigListProps> = (args) => (
  <InputConfigList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  value: [
    { name: "test1", display_name: "Test1", necessity: "required" },
    { name: "test2", display_name: "Test2", necessity: "optional" },
  ],
  onChange: (index, action, newValue) =>
    window.alert(`${action} No.${index} "${JSON.stringify(newValue)}`),
};
