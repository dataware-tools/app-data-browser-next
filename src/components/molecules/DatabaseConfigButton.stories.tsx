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
    {
      label: "Record Input Config",
      value: "record_add_inputable_columns" as const,
    },
    {
      label: "Record Display Config",
      value: "record_list_display_columns" as const,
    },
  ],
  onMenuSelect: (target) => window.alert(`click ${target}!`),
};
