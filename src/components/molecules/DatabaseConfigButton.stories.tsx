import { Story } from "@storybook/react";
import {
  DatabaseConfigButton,
  DatabaseConfigButtonProps,
} from "./DatabaseConfigButton";

export default {
  component: DatabaseConfigButton,
  title: "DatabaseConfigButton",
};

const Template: Story<DatabaseConfigButtonProps> = (args) => (
  <DatabaseConfigButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  menu: [
    { label: "Record Input Config", value: "record_input_config" as const },
    { label: "Record Display Config", value: "record_display_config" as const },
  ],
  onMenuSelect: (target) => window.alert(`click ${target}!`),
};
