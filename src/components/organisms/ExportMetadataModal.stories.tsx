import { Story } from "@storybook/react";
import {
  ExportMetadataModal,
  ExportMetadataModalProps,
} from "./ExportMetadataModal";

export default {
  component: ExportMetadataModal,
  title: "ExportMetadataModal",
};

const Template: Story<ExportMetadataModalProps> = (args) => (
  <ExportMetadataModal {...args} />
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: "default" };
