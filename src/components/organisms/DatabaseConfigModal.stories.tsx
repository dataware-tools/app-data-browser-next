import { Story } from "@storybook/react";
import {
  DatabaseConfigModal,
  DatabaseConfigModalProps,
} from "./DatabaseConfigModal";

export default {
  component: DatabaseConfigModal,
  title: "DatabaseConfigModal",
};

const Template: Story<DatabaseConfigModalProps> = (args) => (
  <DatabaseConfigModal {...args} />
);

export const RecordInputConfig = Template.bind({});
RecordInputConfig.args = {
  open: true,
  onClose: () => window.alert("close!"),
  databaseId: "test1",
  configName: "record_input_config",
};

export const RecordDisplayConfig = Template.bind({});
RecordDisplayConfig.args = {
  open: true,
  onClose: () => window.alert("close!"),
  databaseId: "test1",
  configName: "record_display_config",
};

export const ExportMetadata = Template.bind({});
ExportMetadata.args = {
  open: true,
  onClose: () => window.alert("close!"),
  databaseId: "test1",
  configName: "export_metadata",
};
