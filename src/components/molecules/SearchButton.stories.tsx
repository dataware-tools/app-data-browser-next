import { Story } from "@storybook/react";
import { SearchButton, SearchButtonProps } from "./SearchButton";

export default {
  component: SearchButton,
  title: "SearchButton",
};

const Template: Story<SearchButtonProps> = (args) => <SearchButton {...args} />;

export const Default = Template.bind({});
Default.args = { onSearch: (text) => window.alert(text) };
