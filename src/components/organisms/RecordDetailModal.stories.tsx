import { Story } from "@storybook/react";
import { RecordDetailModal, RecordDetailModalProps } from "./RecordDetailModal";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: RecordDetailModal,
  title: "RecordDetailModal",
};

const Template: Story<RecordDetailModalProps> = (args) => (
  <TestAuthProvider>
    <RecordDetailModal {...args} />
  </TestAuthProvider>
);
export const Default = Template.bind({});
Default.args = {
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  onClose: () => window.alert("close!"),
  open: true,
  recordId: CONST_STORY_BOOK.RECORD_ID,
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
