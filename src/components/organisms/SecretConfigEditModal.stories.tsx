import { Story } from "@storybook/react";
import {
  SecretConfigEditModal,
  SecretConfigEditModalProps,
} from "./SecretConfigEditModal";

export default {
  component: SecretConfigEditModal,
  title: "SecretConfigEditModal",
};

const Template: Story<SecretConfigEditModalProps> = (args) => (
  <SecretConfigEditModal {...args} />
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: "default" };
