import { Story } from "@storybook/react";
import { RecordEditModal, RecordEditModalProps } from "./RecordEditModal";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: RecordEditModal,
  title: "RecordEditModal",
};

const Template: Story<RecordEditModalProps> = (args) => (
  <TestAuthProvider>
    <RecordEditModal {...args} />
  </TestAuthProvider>
);

export const AddRecord = Template.bind({});
AddRecord.args = {
  create: true,
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  onClose: () => console.log("close!"),
  onSubmitSucceeded: (newRecord) =>
    window.alert(`submit success! ${JSON.stringify(newRecord)}`),
  open: true,
};
AddRecord.parameters = CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST;

export const EditRecord = Template.bind({});
EditRecord.args = {
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  onClose: () => console.log("close!"),
  onSubmitSucceeded: (newRecord) =>
    window.alert(`submit success! ${JSON.stringify(newRecord)}`),
  open: true,
  recordId: CONST_STORY_BOOK.RECORD_ID,
};
EditRecord.parameters = CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST;
