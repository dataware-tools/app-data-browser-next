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
  configName: "record_add_inputable_columns",
};

export const RecordDisplayConfig = Template.bind({});
RecordDisplayConfig.args = {
  open: true,
  onClose: () => window.alert("close!"),
  databaseId: "test1",
  configName: "record_list_display_columns",
};

export const ExportMetadata = Template.bind({});
ExportMetadata.args = {
  open: true,
  onClose: () => window.alert("close!"),
  databaseId: "test1",
  configName: "export_metadata",
};
