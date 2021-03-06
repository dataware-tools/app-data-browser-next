import { Story } from "@storybook/react";
import {
  DisplayFieldsConfigBody,
  DisplayFieldsConfigBodyPresentation,
} from "./DisplayFieldsConfigBody";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: DisplayFieldsConfigBody,
  title: "DatabaseConfigModal/DisplayFieldsConfigBody",
};

const Template: Story = () => (
  <TestAuthProvider>
    <DisplayFieldsConfigBody />
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
    <DisplayFieldsConfigBodyPresentation
      displayColumns={["test1", "test2"]}
      displayColumnsOptions={columnOptions}
      onChangeRecordTitleColumn={(titleColumn) => window.alert(titleColumn)}
      recordTitleColumn="test1"
      recordTitleColumnOptions={columnOptions}
      onChangeDisplayColumns={(displayColumns) => {
        window.alert(JSON.stringify(displayColumns));
      }}
    />
  );
};
