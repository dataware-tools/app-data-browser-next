import { Story } from "@storybook/react";
import { RecordEditModal, RecordEditModalProps } from "./RecordEditModal";

export default {
  component: RecordEditModal,
  title: "RecordEditModal",
};

const Template: Story<RecordEditModalProps> = (args) => (
  <RecordEditModal {...args} />
);

export const AddRecord = Template.bind({});
AddRecord.args = {
  create: true,
  databaseId: "test1",
  onClose: () => console.log("close!"),
  onSubmitSucceeded: (newRecord) =>
    window.alert(`submit success! ${JSON.stringify(newRecord)}`),
  open: true,
};

export const EditRecord = Template.bind({});
EditRecord.args = {
  databaseId: "test1",
  onClose: () => console.log("close!"),
  onSubmitSucceeded: (newRecord) =>
    window.alert(`submit success! ${JSON.stringify(newRecord)}`),
  open: true,
  recordId: "20210602-142444-783",
};
