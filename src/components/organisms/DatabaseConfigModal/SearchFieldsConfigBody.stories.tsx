import { Story } from "@storybook/react";
import {
  SearchFieldsConfigBody,
  SearchFieldsConfigBodyProps,
  SearchFieldsConfigBodyPresentation,
} from "./SearchFieldsConfigBody";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: SearchFieldsConfigBody,
  title: "DatabaseConfigModal/SearchFieldsConfigBody",
};

const Template: Story<SearchFieldsConfigBodyProps> = (args) => (
  <TestAuthProvider>
    <SearchFieldsConfigBody {...args} />
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
      isDisableSaveButton={false}
      searchTargetColumns={["test1", "test2"]}
      searchTargetColumnsOptions={columnOptions}
      isFetchComplete
      isSaving={false}
      onSave={() => {
        window.alert("save");
      }}
      onChangeSearchTargetColumns={(searchColumns) => {
        window.alert(JSON.stringify(searchColumns));
      }}
    />
  );
};
