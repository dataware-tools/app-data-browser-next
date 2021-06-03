import { Story } from "@storybook/react";
import { RecordDetailModal, RecordDetailModalProps } from "./RecordDetailModal";

export default {
  component: RecordDetailModal,
  title: "RecordDetailModal",
};

const Template: Story<RecordDetailModalProps> = (args) => (
  <RecordDetailModal {...args} />
);
export const Default = Template.bind({});
Default.args = {
  databaseId: "test1",
  onClose: () => window.alert("close!"),
  open: true,
  recordId: "20210602-142444-783",
};
