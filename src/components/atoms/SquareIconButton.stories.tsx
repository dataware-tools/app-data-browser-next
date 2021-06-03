import AddCircle from "@material-ui/icons/AddCircle";
import { Story } from "@storybook/react";
import { SquareIconButton, SquareIconButtonProps } from "./SquareIconButton";

export default {
  component: SquareIconButton,
  title: "SquareIconButton",
};

const Template: Story<SquareIconButtonProps> = (args) => (
  <SquareIconButton {...args} />
);

export const Default = Template.bind({});
Default.args = { icon: <AddCircle />, onClick: () => window.alert("click!") };
