import { Story } from "@storybook/react";
import { FileList, FileListProps } from "./FileList";

export default {
  component: FileList,
  title: "FileList",
};

const Template: Story<FileListProps> = (args) => <FileList {...args} />;

export const Default = Template.bind({});
Default.args = {
  files: [{ path: "test/test/test1.test" }, { path: "test/test/test2.test" }],
  onDelete: (file) => window.alert(`delete! ${JSON.stringify(file)}`),
  onEdit: (file) => window.alert(`edit! ${JSON.stringify(file)}`),
  onPreview: (file) => window.alert(`preview! ${JSON.stringify(file)}`),
  onDownload: (file) => window.alert(`download! ${JSON.stringify(file)}`),
};
