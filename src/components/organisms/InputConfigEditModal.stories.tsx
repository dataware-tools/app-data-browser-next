import { Story } from "@storybook/react";
import {
  InputConfigEditModal,
  InputConfigEditModalProps,
} from "./InputConfigEditModal";

export default {
  component: InputConfigEditModal,
  title: "InputConfigEditModal",
};

const Template: Story<InputConfigEditModalProps> = (args) => (
  <InputConfigEditModal {...args} />
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: "default" };
