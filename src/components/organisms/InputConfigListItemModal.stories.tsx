import { Story } from "@storybook/react";
import {
  InputConfigListItemModal,
  InputConfigListItemModalProps,
  NewColumnType,
} from "./InputConfigListItemModal";
import { CONST_STORY_BOOK } from "test-utils";

export default {
  component: InputConfigListItemModal,
  title: "InputConfigListItemModal",
};

const Template: Story<InputConfigListItemModalProps> = (args) => (
  <InputConfigListItemModal {...args} />
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
  alreadyUsedNames: ["test1"],
};
// TODO: Include visual regression test.
// (If InputConfigListItemModal can consume "disablePortal" props, this story may be able to be included visual regression test)
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };

export const WithInitialData = Template.bind({});
WithInitialData.args = {
  open: true,
  onSave: (newConfig: NewColumnType) =>
    window.alert(`save! ${JSON.stringify(newConfig)}`),
  options: [
    { name: "test1", display_name: "Test1" },
    { name: "test2", display_name: "Test2" },
  ],
  alreadyUsedDisplayNames: ["Test1", "Test2"],
  alreadyUsedNames: [],
  initialData: {
    name: "test1",
    display_name: "Test1",
    necessity: "required",
    is_secret: true,
  },
};
// TODO: Include visual regression test.
// (If InputConfigListItemModal can consume "disablePortal" props, this story may be able to be included visual regression test)
WithInitialData.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};
