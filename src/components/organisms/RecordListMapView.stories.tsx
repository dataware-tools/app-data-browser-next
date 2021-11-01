import { Story } from "@storybook/react";
import { RecordListMapView, RecordListMapViewProps } from "./RecordListMapView";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: RecordListMapView,
  title: "RecordListMapView",
};

const Template: Story<RecordListMapViewProps> = (args) => (
  <TestAuthProvider>
    <div
      style={{
        height: "500px",
        width: "500px",
      }}
    >
      <RecordListMapView {...args} />
    </div>
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = {
  databaseId: "map-view-test",
  page: 1,
  perPage: 20,
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
