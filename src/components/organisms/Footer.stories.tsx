import { Story } from "@storybook/react";
import { Footer } from "./Footer";

export default {
  component: Footer,
  title: "Footer",
};

const Template: Story = (args) => <Footer {...args} />;
export const Default = Template.bind({});
