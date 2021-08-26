import { Story } from "@storybook/react";
import { Sample, SampleProps } from "./Sample";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: Sample,
  title: "Sample",
};

const Template: Story<SampleProps> = (args) => (
  <TestAuthProvider>
    <Sample {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { sample: "sample" };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
