import { Story } from "@storybook/react";
import { Header } from "./Header";

export default {
  component: Header,
  title: "Header",
};

const Template: Story = (args) => <Header {...args} />;
export const Default = Template.bind({});
