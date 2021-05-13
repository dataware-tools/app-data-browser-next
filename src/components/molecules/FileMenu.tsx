import PageviewIcon from "@material-ui/icons/Pageview";
import DeleteIcon from "@material-ui/icons/Delete";
import FileDownloadIcon from "@material-ui/icons/FileDownload";
import EditIcon from "@material-ui/icons/Edit";
import Menu from "@material-ui/core/Menu";
import { FileMenuItem } from "components/atoms/FileMenuItem";

type ComponentProps = {
  onPreview?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onClose: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
};

const Component = ({
  onPreview,
  onEdit,
  onDelete,
  onDownload,
  onClose,
  open,
  anchorEl,
}: ComponentProps): JSX.Element => (
  <Menu
    open={open}
    onClose={onClose}
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
  >
    {onPreview ? (
      <FileMenuItem
        onClick={() => {
          onClose();
          onPreview();
        }}
        icon={<PageviewIcon />}
        text="Preview"
      />
    ) : null}

    {onEdit ? (
      <FileMenuItem
        onClick={() => {
          onClose();
          onEdit();
        }}
        icon={<EditIcon />}
        text="Edit"
      />
    ) : null}

    {onDelete ? (
      <FileMenuItem
        onClick={() => {
          onClose();
          onDelete();
        }}
        icon={<DeleteIcon />}
        text="Delete"
      />
    ) : null}

    {onDownload ? (
      <FileMenuItem
        onClick={() => {
          onClose();
          onDownload();
        }}
        icon={<FileDownloadIcon />}
        text="Download"
      />
    ) : null}
  </Menu>
);

export { Component as FileMenu };
export type { ComponentProps as FileMenuProps };
