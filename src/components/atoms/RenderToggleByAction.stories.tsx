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
  <div>
    Rendered below if you have appropriate permission
    <br />
    <RenderToggleByAction {...args} />
  </div>
);

export const Render = Template.bind({});
Render.args = { children: <div>rendered!</div>, required: "databases:write" };

export const NotRender = Template.bind({});
NotRender.args = {
  children: <div>not render</div>,
  // @ts-expect-error for test
  required: "EndUser",
};
