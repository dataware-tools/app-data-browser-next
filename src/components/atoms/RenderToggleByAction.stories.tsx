import { Story } from "@storybook/react";
import {
  RenderToggleByAction,
  RenderToggleByActionProps,
} from "./RenderToggleByAction";

export default {
  component: RenderToggleByAction,
  title: "RenderToggleByAction",
};

const Template: Story<RenderToggleByActionProps> = (args) => (
  <RenderToggleByAction {...args} />
);

export const Render = Template.bind({});
Render.args = { children: <div>render</div>, required: "databases:write" };

export const NotRender = Template.bind({});
NotRender.args = {
  children: <div>not render</div>,
  // @ts-expect-error for test
  required: "unknown",
};
