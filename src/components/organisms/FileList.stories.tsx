import { Story } from "@storybook/react";
import { FileList, FileListProps } from "./FileList";

export default {
  component: FileList,
  title: "FileList",
};

const Template: Story<FileListProps> = (args) => <FileList {...args} />;

export const Default = Template.bind({});
Default.args = {
  databaseId: "default",
  recordId: "20210701-123756-142",
};
