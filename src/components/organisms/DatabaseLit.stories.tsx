import { Story } from "@storybook/react";
import { DatabaseList, DatabaseListProps } from "./DatabaseList";

export default {
  component: DatabaseList,
  title: "DatabaseList",
};

const Template: Story<DatabaseListProps> = (args) => <DatabaseList {...args} />;
export const Default = Template.bind({});
Default.args = {
  databases: [
    { database_id: "1", name: "test1", description: "test1" },
    { database_id: "2", name: "test2", description: "test2" },
    { database_id: "3" },
  ],
};
