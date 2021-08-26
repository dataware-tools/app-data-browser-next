import { Story } from "@storybook/react";
import {
  ExportMetadataModal,
  ExportMetadataModalProps,
} from "./ExportMetadataModal";
import { CONST_STORY_BOOK, TestAuthProvider } from "test-utils";

export default {
  component: ExportMetadataModal,
  title: "ExportMetadataModal",
};

const Template: Story<ExportMetadataModalProps> = (args) => (
  <TestAuthProvider>
    <ExportMetadataModal {...args} />
  </TestAuthProvider>
);

export const Default = Template.bind({});
Default.args = { open: true, databaseId: CONST_STORY_BOOK.DATABASE_ID };
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
