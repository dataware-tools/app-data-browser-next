import { Story } from "@storybook/react";
import { PageWrapper, PageWrapperProps } from "./PageWrapper";

export default {
  component: PageWrapper,
  title: "PageWrapper",
};

const Template: Story<PageWrapperProps> = (args) => <PageWrapper {...args} />;
export const Default = Template.bind({});
Default.args = {
  children: (
    <div>
      Scroll down!
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  ),
};
