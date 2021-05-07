import { Story } from "@storybook/react";
import { ExampleApp } from "./ExampleApp";

export default {
  component: ExampleApp,
  title: "ExampleApp",
};

const Template: Story = (args) => <ExampleApp {...args} />;
export const Default = Template.bind({});
