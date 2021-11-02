import { Story } from "@storybook/react";
import {
  SecretFieldsConfigBody,
  SecretFieldsConfigBodyPresentation,
} from "./SecretFieldsConfigBody";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: SecretFieldsConfigBody,
  title: "DatabaseConfigModal/SecretFieldsConfigBody",
};

const Template: Story = (args) => (
  <TestAuthProvider>
    <SecretFieldsConfigBody {...args} />
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
    <SecretFieldsConfigBodyPresentation
      secretColumns={["test1", "test2"]}
      secretColumnsOptions={columnOptions}
      onChangeSecretColumns={(secretColumns) => {
        window.alert(JSON.stringify(secretColumns));
      }}
    />
  );
};
