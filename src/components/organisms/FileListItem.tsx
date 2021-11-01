import { metaStore } from "@dataware-tools/api-meta-store-client";
import { theme as themeInstance } from "@dataware-tools/app-common";
import DescriptionIcon from "@mui/icons-material/Description";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import { MouseEvent, useState } from "react";
import { FileMenu } from "components/molecules/FileMenu";
import { getFileName } from "utils";

export type FileType = metaStore.FileModel;
export type FileListItemPresentationProps = {
  menuProps: {
    onClose: () => void;
    open: boolean;
    anchorEl: HTMLDivElement | null;
  };
  onMenuOpen: (event: MouseEvent<HTMLDivElement>) => void | Promise<void>;
} & FileListItemProps;

type onMenuClick = (file: FileType) => void | Promise<void>;
export type FileListItemProps = {
  onPreview: onMenuClick;
  onEdit: onMenuClick;
  onDelete: onMenuClick;
  onDownload: onMenuClick;
  file: FileType;
};

export const FileListItemPresentation = ({
  file,
  onMenuOpen,
  menuProps,
  onPreview,
  onEdit,
  onDelete,
  onDownload,
}: FileListItemPresentationProps): JSX.Element | null => {
  if (
    file.path == null ||
    file.path === "" ||
    file.path === "/" ||
    file.path === "/."
  )
    return null;

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
      <ListItemText primary={file.displayPath || getFileName(file.path)} />
      <ListItemSecondaryAction>
        <FileMenu
          {...menuProps}
          onPreview={async () => await onPreview(file)}
          onEdit={async () => await onEdit(file)}
          onDelete={async () => await onDelete(file)}
          onDownload={async () => await onDownload(file)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export const FileListItem = ({
  file,
  ...delegated
}: FileListItemProps): JSX.Element => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLDivElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const onMenuOpen: FileListItemPresentationProps["onMenuOpen"] = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <FileListItemPresentation
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
