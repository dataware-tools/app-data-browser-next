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
    {
      name: "test1",
      display_name: "Test1",
      necessity: "required",
      order_of_input: 1,
      is_secret: false,
      dtype: "string",
      aggregation: "first",
    },
    {
      name: "test2",
      display_name: "Test2",
      necessity: "optional",
      order_of_input: 0,
      is_secret: true,
      dtype: "string",
      aggregation: "first",
    },
  ],
  onChange: (newValue) =>
    window.alert(`new Config: ${JSON.stringify(newValue)}`),
};
