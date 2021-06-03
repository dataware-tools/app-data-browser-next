import { Story } from "@storybook/react";
import { Sample, SampleProps } from "./Sample";

export default {
  component: Sample,
  title: "Sample",
};

const Template: Story<SampleProps> = (args) => <Sample {...args} />;

export const Default = Template.bind({});
Default.args = { sample: "sample" };
