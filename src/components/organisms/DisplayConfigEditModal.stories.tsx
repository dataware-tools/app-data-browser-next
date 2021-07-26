import { Story } from "@storybook/react";
import {
  DisplayConfigEditModal,
  DisplayConfigEditModalProps,
} from "./DisplayConfigEditModal";

export default {
  component: DisplayConfigEditModal,
  title: "DisplayConfigEditModal",
};

const Template: Story<DisplayConfigEditModalProps> = (args) => (
  <DisplayConfigEditModal {...args} />
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: "default" };
