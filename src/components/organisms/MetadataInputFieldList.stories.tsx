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
  fields: [
    {
      name: "required",
      display_name: "Required",
      necessity: "required",
      dtype: "string",
      aggregation: "first",
    },
    {
      name: "recommended",
      display_name: "Recommended",
      necessity: "recommended",
      dtype: "string",
      aggregation: "first",
    },
    {
      name: "optional",
      display_name: "Optional",
      necessity: "optional",
      dtype: "string",
      aggregation: "first",
    },
  ],
  prefixInputElementId: "#",
};
