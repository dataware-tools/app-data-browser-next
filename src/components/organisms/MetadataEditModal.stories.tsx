import { Story } from "@storybook/react";
import { MetadataEditModal, MetadataEditModalProps } from "./MetadataEditModal";
import { sleep } from "utils";

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
    },
  ],
  create: true,
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
    },
    {
      name: "test2",
      display_name: "Test2",
      necessity: "recommended",
    },
  ],
  currentMetadata: {
    test1: "test1",
    test2: "test2",
  },
};

export const NoConfigErrorOccur = Template.bind({});
NoConfigErrorOccur.args = {
  onClose: () => window.alert("close!"),
  onSubmit: async (newValue) => {
    window.alert(`submit! ${JSON.stringify(newValue)}`);
    sleep(1000);
    return Math.random() > 0.5;
  },
  open: true,
  currentMetadata: {
    test1: "test1",
    test2: "test2",
  },
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
  error: "fetch error occur",
};
