import { Story } from "@storybook/react";
import { Sample } from "./Sample";

export default {
  component: Sample,
  title: "Sample",
};

const Template: Story = (args) => <Sample {...args} />;
export const Default = Template.bind({});
