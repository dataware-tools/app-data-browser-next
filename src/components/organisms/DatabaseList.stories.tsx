import { Story } from "@storybook/react";
import { DatabaseList, DatabaseListProps } from "./DatabaseList";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: DatabaseList,
  title: "DatabaseList",
};

const Template: Story<DatabaseListProps> = (args) => (
  <TestAuthProvider>
    <div style={{ height: "50vh" }}>
      <DatabaseList {...args} />
    </div>
  </TestAuthProvider>
);
export const Default = Template.bind({});
Default.args = {
  page: 1,
  perPage: 20,
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
