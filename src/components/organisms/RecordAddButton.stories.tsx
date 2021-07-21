import { Story } from "@storybook/react";
import { RecordAddButton, RecordAddButtonProps } from "./RecordAddButton";

export default {
  component: RecordAddButton,
  title: "RecordAddButton",
};

const Template: Story<RecordAddButtonProps> = (args) => (
  <RecordAddButton {...args} />
);

export const Default = Template.bind({});
Default.args = { databaseId: "default" };
