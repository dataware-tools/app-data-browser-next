import { metaStore, theme as themeInstance } from "@dataware-tools/app-common";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DescriptionIcon from "@material-ui/icons/Description";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { MouseEvent, useState } from "react";
import { FileMenu } from "components/molecules/FileMenu";

type Props = {
  menuProps: {
    onClose: () => void;
    open: boolean;
    anchorEl: HTMLDivElement | null;
  };
  onMenuOpen: (event: MouseEvent<HTMLDivElement>) => void;
} & ContainerProps;

type onMenuClick = (file: metaStore.FileModel) => void;
type ContainerProps = {
  onPreview: onMenuClick;
  onEdit: onMenuClick;
  onDelete: onMenuClick;
  onDownload: onMenuClick;
  file: metaStore.FileModel;
};

const Component = ({
  file,
  onMenuOpen,
  menuProps,
  onPreview,
  onEdit,
  onDelete,
  onDownload,
}: Props): JSX.Element | null => {
  if (file.path == null) return null;

  return (
    <ListItem
      button
      onClick={onMenuOpen}
      style={
        menuProps.open
          ? { backgroundColor: themeInstance.palette.action.hover }
          : undefined
      }
    >
      <ListItemIcon>
        <DescriptionIcon />
      </ListItemIcon>
      <ListItemText primary={file.path.split("/").slice(-1)[0]} />
      <ListItemSecondaryAction>
        <FileMenu
          {...menuProps}
          onPreview={() => onPreview(file)}
          onEdit={() => onEdit(file)}
          onDelete={() => onDelete(file)}
          onDownload={() => onDownload(file)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const Container = ({ file, ...delegated }: ContainerProps): JSX.Element => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLDivElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const onMenuOpen: Props["onMenuOpen"] = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Component
      file={file}
      onMenuOpen={onMenuOpen}
      menuProps={{
        open: isMenuOpen,
        anchorEl: menuAnchorEl,
        onClose: onMenuClose,
      }}
      {...delegated}
    />
  );
};

export { Container as FileListItem };
export type { ContainerProps as FileListItemProps };