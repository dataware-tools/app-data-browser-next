import { Story } from "@storybook/react";
import {
  InputFieldsConfigBody,
  InputFieldsConfigBodyPresentation,
} from "./InputFieldsConfigBody";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: InputFieldsConfigBody,
  title: "DatabaseConfigModal/InputFieldsConfigBody",
};

const Template: Story = (args) => (
  <TestAuthProvider>
    <InputFieldsConfigBody {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };

export const Presentation = (): JSX.Element => (
  <InputFieldsConfigBodyPresentation
    inputColumns={[
      {
        order_of_input: 1,
        display_name: "test1",
        name: "Test1",
        necessity: "required",
        is_secret: false,
      },
      {
        order_of_input: 2,
        display_name: "test2",
        name: "Test2",
        necessity: "optional",
        is_secret: true,
      },
    ]}
    nonInputColumns={[]}
    onChangeInputColumns={(inputColumns) => {
      window.alert(JSON.stringify(inputColumns));
    }}
  />
);
