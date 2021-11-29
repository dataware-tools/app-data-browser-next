import { sleep } from "@dataware-tools/app-common";
import { Story } from "@storybook/react";
import { MetadataEditModal, MetadataEditModalProps } from "./MetadataEditModal";
import { CONST_STORY_BOOK } from "test-utils";

export default {
  component: MetadataEditModal,
  title: "MetadataEditModal",
};

const Template: Story<MetadataEditModalProps> = (args) => (
  <MetadataEditModal {...args} />
);
export const AddMetadata = Template.bind({});

AddMetadata.args = {
  onClose: () => window.alert("close!"),
  onSubmit: async (newValue) => {
    window.alert(`submit! ${JSON.stringify(newValue)}`);
    sleep(1000);
    return Math.random() > 0.5;
  },
  open: true,
  fields: [
    {
      name: "test1",
      display_name: "Test1",
      necessity: "recommended",
      dtype: "string",
      aggregation: "first",
    },
  ],
  create: true,
};
// TODO: Include visual regression test.
// (If MetadataEditModal can consume "disablePortal" props, this story may be able to be included visual regression test)
AddMetadata.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};

export const EditMetadata = Template.bind({});
EditMetadata.args = {
  onClose: () => window.alert("close!"),
  onSubmit: async (newValue) => {
    window.alert(`submit! ${JSON.stringify(newValue)}`);
    sleep(1000);
    return Math.random() > 0.5;
  },
  open: true,
  fields: [
    {
      name: "test1",
      display_name: "Test1",
      necessity: "recommended",
      dtype: "string",
      aggregation: "first",
    },
    {
      name: "test2",
      display_name: "Test2",
      necessity: "recommended",
      dtype: "string",
      aggregation: "first",
    },
  ],
  currentMetadata: {
    test1: "test1",
    test2: "test2",
  },
};
// TODO: Include visual regression test.
// (If MetadataEditModal can consume "disablePortal" props, this story may be able to be included visual regression test)
EditMetadata.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};

export const NoConfigErrorOccur = Template.bind({});
NoConfigErrorOccur.args = {
  onClose: () => window.alert("close!"),
  onSubmit: async (newValue) => {
    window.alert(`submit! ${JSON.stringify(newValue)}`);
    sleep(1000);
    return Math.random() > 0.5;
  },
  fields: [],
  open: true,
  currentMetadata: {
    test1: "test1",
    test2: "test2",
  },
};
// TODO: Include visual regression test.
// (If MetadataEditModal can consume "disablePortal" props, this story may be able to be included visual regression test)
NoConfigErrorOccur.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};

export const FetchErrorOccur = Template.bind({});
FetchErrorOccur.args = {
  onClose: () => window.alert("close!"),
  onSubmit: async (newValue) => {
    window.alert(`submit! ${JSON.stringify(newValue)}`);
    sleep(1000);
    return Math.random() > 0.5;
  },
  open: true,
  error: {
    reason: "Fetch error occur!",
    instruction: "Please reload this page",
  },
};
// TODO: Include visual regression test.
// (If MetadataEditModal can consume "disablePortal" props, this story may be able to be included visual regression test)
FetchErrorOccur.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};
