import {
  FileListItem,
  FileListItemProps,
} from "components/organisms/FileListItem";
import List from "@material-ui/core/List";

type Props = {
  files: FileListItemProps["file"][];
  onPreview: FileListItemProps["onPreview"];
  onDelete: FileListItemProps["onDelete"];
  onEdit: FileListItemProps["onEdit"];
  onDownload: FileListItemProps["onDownload"];
};

const Component = ({ files, ...delegated }: Props): JSX.Element => {
  return (
    <List>
      {files.map((file) => {
        return <FileListItem key={file.path} file={file} {...delegated} />;
      })}
    </List>
  );
};

export { Component as FileList };
export type { Props as FileListProps };
