import { Story } from "@storybook/react";
import {
  MetadataInputFieldList,
  MetadataInputFieldListProps,
} from "./MetadataInputFieldList";

export default {
  component: MetadataInputFieldList,
  title: "MetadataInputFieldList",
};

const Template: Story<MetadataInputFieldListProps> = (args) => (
  <MetadataInputFieldList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  currentMetadata: { required: "required" },
  fields: [
    { name: "required", display_name: "Required", necessity: "required" },
    {
      name: "recommended",
      display_name: "Recommended",
      necessity: "recommended",
    },
    { name: "optional", display_name: "Optional", necessity: "optional" },
  ],
  prefixInputElementId: "#",
  nonFilledRequiredFieldNames: [],
};
