import { Story } from "@storybook/react";
import { SearchFormModal, SearchFormModalProps } from "./SearchFormModal";

export default {
  component: SearchFormModal,
  title: "SearchFormModal",
};

const Template: Story<SearchFormModalProps> = (args) => (
  <SearchFormModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true,
  onSearch: (text) => window.alert(text),
  onClose: () => window.alert("close"),
};
