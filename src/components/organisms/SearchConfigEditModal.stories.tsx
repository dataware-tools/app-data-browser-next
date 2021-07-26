import { Story } from "@storybook/react";
import {
  SearchConfigEditModal,
  SearchConfigEditModalProps,
} from "./SearchConfigEditModal";

export default {
  component: SearchConfigEditModal,
  title: "SearchConfigEditModal",
};

const Template: Story<SearchConfigEditModalProps> = (args) => (
  <SearchConfigEditModal {...args} />
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: "default" };
