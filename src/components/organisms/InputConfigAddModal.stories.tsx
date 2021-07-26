import { Story } from "@storybook/react";
import {
  InputConfigAddModal,
  InputConfigAddModalProps,
  NewColumnType,
} from "./InputConfigAddModal";

export default {
  component: InputConfigAddModal,
  title: "InputConfigAddModal",
};

const Template: Story<InputConfigAddModalProps> = (args) => (
  <InputConfigAddModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true,
  onSave: (newConfig: NewColumnType) =>
    window.alert(`save! ${JSON.stringify(newConfig)}`),
  options: [
    { name: "test1", display_name: "Test1" },
    { name: "test2", display_name: "Test2" },
  ],
  alreadyUsedDisplayNames: ["Test1", "Test2"],
};
