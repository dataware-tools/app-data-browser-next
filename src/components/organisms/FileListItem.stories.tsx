import List from "@material-ui/core/List";
import { Story } from "@storybook/react";
import { FileListItem, FileListItemProps } from "./FileListItem";

export default {
  component: FileListItem,
  title: "FileListItem",
};

const Template: Story<FileListItemProps> = (args) => (
  <List>
    <FileListItem {...args} />
  </List>
);

export const Default = Template.bind({});
Default.args = {
  file: { path: "test/test/test1.test" },
  onDelete: (file) => window.alert(`delete! ${JSON.stringify(file)}`),
  onEdit: (file) => window.alert(`edit! ${JSON.stringify(file)}`),
  onPreview: (file) => window.alert(`preview! ${JSON.stringify(file)}`),
  onDownload: (file) => window.alert(`download! ${JSON.stringify(file)}`),
};
