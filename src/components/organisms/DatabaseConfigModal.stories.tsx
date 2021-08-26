import { Story } from "@storybook/react";
import {
  DatabaseConfigModal,
  DatabaseConfigModalProps,
} from "./DatabaseConfigModal";
import { TestAuthProvider, CONST_STORY_BOOK } from "test-utils";

export default {
  component: DatabaseConfigModal,
  title: "DatabaseConfigModal",
};

const Template: Story<DatabaseConfigModalProps> = (args) => (
  <TestAuthProvider>
    <DatabaseConfigModal {...args} />
  </TestAuthProvider>
);

export const RecordInputConfig = Template.bind({});
RecordInputConfig.args = {
  open: true,
  onClose: () => window.alert("close!"),
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  configName: "record_add_editable_columns",
};
RecordInputConfig.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};

export const RecordDisplayConfig = Template.bind({});
RecordDisplayConfig.args = {
  open: true,
  onClose: () => window.alert("close!"),
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  configName: "record_list_display_columns",
};
RecordDisplayConfig.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};

export const ExportMetadata = Template.bind({});
ExportMetadata.args = {
  open: true,
  onClose: () => window.alert("close!"),
  databaseId: CONST_STORY_BOOK.DATABASE_ID,
  configName: "export_metadata",
};
ExportMetadata.parameters = {
  ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST,
};
