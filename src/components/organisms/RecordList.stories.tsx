import { Story } from "@storybook/react";
import { RecordList, RecordListProps } from "./RecordList";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: RecordList,
  title: "RecordList",
};

const Template: Story<RecordListProps> = (args) => (
  <TestAuthProvider>
    <div style={{ height: "50vh" }}>
      <RecordList {...args} />
    </div>
  </TestAuthProvider>
);
export const Default = Template.bind({});
Default.args = {
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  page: 1,
  perPage: 20,
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
