import { Story } from "@storybook/react";
import { RecordList, RecordListProps } from "./RecordList";

export default {
  component: RecordList,
  title: "RecordList",
};

const Template: Story<RecordListProps> = (args) => <RecordList {...args} />;
export const Default = Template.bind({});
Default.args = {
  databaseId: "default",
  page: 1,
  perPage: 20,
};
