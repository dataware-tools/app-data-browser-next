import { Story } from "@storybook/react";
import { DatabaseList, DatabaseListProps } from "./DatabaseList";

export default {
  component: DatabaseList,
  title: "DatabaseList",
};

const Template: Story<DatabaseListProps> = (args) => <DatabaseList {...args} />;
export const Default = Template.bind({});
Default.args = {
  page: 1,
  perPage: 20,
};
