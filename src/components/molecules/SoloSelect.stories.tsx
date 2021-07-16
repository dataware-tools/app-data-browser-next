import { Story } from "@storybook/react";
import { SoloSelect, SoloSelectProps } from "./SoloSelect";

export default {
  component: SoloSelect,
  title: "SoloSelect",
};

const Template: Story<SoloSelectProps> = (args) => <SoloSelect {...args} />;

export const Default = Template.bind({});
Default.args = {
  onChange: (newValue) => window.alert(`newValue: ${newValue}`),
  options: [
    { label: "Test1", value: "test1" },
    { label: "Test2", value: "test2" },
    { label: "Test3", value: "test3" },
  ],
};
