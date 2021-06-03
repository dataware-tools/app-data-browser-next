import {
  FileListItem,
  FileListItemProps,
} from "components/organisms/FileListItem";
import List from "@material-ui/core/List";

type Props = ContainerProps;

type ContainerProps = {
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

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  return <Component {...delegated} />;
};

export { Container as FileList };
export type { ContainerProps as FileListProps };
