import { Story } from "@storybook/react";
import {
  ElemCenteringFlexDiv,
  ElemCenteringFlexDivProps,
} from "./ElemCenteringFlexDiv";

export default {
  component: ElemCenteringFlexDiv,
  title: "ElemCenteringFlexDiv",
};

const Template: Story<ElemCenteringFlexDivProps> = (args) => (
  <ElemCenteringFlexDiv {...args} />
);

export const Default = Template.bind({});
Default.args = { children: "test" };
