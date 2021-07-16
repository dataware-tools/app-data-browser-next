import { Story } from "@storybook/react";
import { DatabaseAddModal, DatabaseAddModalProps } from "./DatabaseAddModal";

export default {
  component: DatabaseAddModal,
  title: "DatabaseAddModal",
};

const Template: Story<DatabaseAddModalProps> = (args) => (
  <DatabaseAddModal {...args} />
);

export const Default = Template.bind({});
Default.args = { open: true };
