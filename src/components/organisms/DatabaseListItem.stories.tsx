import List from "@material-ui/core/List";
import { Story } from "@storybook/react";
import { DatabaseListItem, DatabaseListItemProps } from "./DatabaseListItem";

export default {
  component: DatabaseListItem,
  title: "DatabaseListItem",
};

const Template: Story<DatabaseListItemProps> = (args) => (
  <List>
    <DatabaseListItem {...args} />
  </List>
);

export const Default = Template.bind({});
Default.args = {
  database: { database_id: "test", name: "Test", description: "this is test" },
  onClick: (database) => window.alert(`click! ${JSON.stringify(database)}`),
};

export const NoNameAndDescription = Template.bind({});
NoNameAndDescription.args = {
  database: { database_id: "test" },
  onClick: (database) => window.alert(`click! ${JSON.stringify(database)}`),
};
