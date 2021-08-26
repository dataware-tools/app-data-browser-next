import { Story } from "@storybook/react";
import {
  InputConfigAddModal,
  InputConfigAddModalProps,
  NewColumnType,
} from "./InputConfigAddModal";
import { CONST_STORY_BOOK } from "test-utils";

export default {
  component: InputConfigAddModal,
  title: "InputConfigAddModal",
};

const Template: Story<InputConfigAddModalProps> = (args) => (
  <InputConfigAddModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true,
  onSave: (newConfig: NewColumnType) =>
    window.alert(`save! ${JSON.stringify(newConfig)}`),
  options: [
    { name: "test1", display_name: "Test1" },
    { name: "test2", display_name: "Test2" },
  ],
  alreadyUsedDisplayNames: ["Test1", "Test2"],
};
// TODO: Include visual regression test.
// (If InputConfigAddModal can consume "disablePortal" props, this story may be able to be included visual regression test)
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
