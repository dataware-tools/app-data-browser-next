import { Story } from "@storybook/react";
import {
  SearchFieldsConfigBody,
  SearchFieldsConfigBodyPresentation,
} from "./SearchFieldsConfigBody";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: SearchFieldsConfigBody,
  title: "DatabaseConfigModal/SearchFieldsConfigBody",
};

const Template: Story = () => (
  <TestAuthProvider>
    <SearchFieldsConfigBody />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };

export const Presentation = (): JSX.Element => {
  const columnOptions = [
    { label: "test1", value: "test1" },
    { label: "test2", value: "test2" },
    { label: "test3", value: "test3" },
  ];
  return (
    <SearchFieldsConfigBodyPresentation
      searchTargetColumns={["test1", "test2"]}
      searchTargetColumnsOptions={columnOptions}
      onChangeSearchTargetColumns={(searchColumns) => {
        window.alert(JSON.stringify(searchColumns));
      }}
    />
  );
};
