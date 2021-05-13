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
Default.args = { open: true, onClose: () => window.alert("close!") };
