import { Story } from "@storybook/react";
import { RosbagPreviewer, RosbagPreviewerProps } from "./";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: RosbagPreviewer,
  title: "FilePreview/RosbagPreviewer",
};

const Template: Story<RosbagPreviewerProps> = (args) => (
  <TestAuthProvider>
    <RosbagPreviewer {...args} />
  </TestAuthProvider>
);
export const Default = Template.bind({});
Default.args = {
  filePath:
    "/data_pool_8/meti-tmp/tracking_results/car3/2020-12-17-12-51-47/2020-12-17-12-51-47.bag",
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
