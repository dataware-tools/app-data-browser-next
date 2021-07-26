import { Story } from "@storybook/react";
import { DatabaseAddButton, DatabaseAddButtonProps } from "./DatabaseAddButton";

export default {
  component: DatabaseAddButton,
  title: "DatabaseAddButton",
};

const Template: Story<DatabaseAddButtonProps> = (args) => (
  <DatabaseAddButton {...args} />
);

export const Default = Template.bind({});
Default.args = {};
