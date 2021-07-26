import { Story } from "@storybook/react";
import { RecordInfo, RecordInfoProps } from "./RecordInfo";

export default {
  component: RecordInfo,
  title: "RecordInfo",
};

const Template: Story<RecordInfoProps> = (args) => <RecordInfo {...args} />;

export const Default = Template.bind({});
Default.args = { databaseId: "default", recordId: "20210701-123756-142" };
