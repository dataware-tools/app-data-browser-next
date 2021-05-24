import { Story } from "@storybook/react";
import { RecordList, RecordListProps } from "./RecordList";

export default {
  component: RecordList,
  title: "RecordList",
};

const Template: Story<RecordListProps> = (args) => <RecordList {...args} />;
export const Default = Template.bind({});
Default.args = {
  records: [
    {
      description: "test1",
      record_id: "test1",
      start_timestamp: 1,
      end_timestamp: 3,
    },
    {
      description: "test2",
      record_id: "test2",
      start_timestamp: 3,
      end_timestamp: 4,
    },
  ],
  onSelectRecord: (targetDetail) => {
    window.alert(
      `Should open modal showing records detail! ${JSON.stringify(
        targetDetail
      )}`
    );
  },
  columns: [{ field: "description" }, { field: "record_id" }],
};