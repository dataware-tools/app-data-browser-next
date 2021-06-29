import PageviewIcon from "@material-ui/icons/Pageview";
import DeleteIcon from "@material-ui/icons/Delete";
import FileDownloadIcon from "@material-ui/icons/FileDownload";
import EditIcon from "@material-ui/icons/Edit";
import Menu from "@material-ui/core/Menu";
import { FileMenuItem, FileMenuItemProps } from "components/atoms/FileMenuItem";
import { RenderToggleByAction } from "components/atoms/RenderToggleByAction";

type ComponentProps = {
  onPreview?: FileMenuItemProps["onClick"];
  onEdit?: FileMenuItemProps["onClick"];
  onDelete?: FileMenuItemProps["onClick"];
  onDownload?: FileMenuItemProps["onClick"];
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
}: ComponentProps): JSX.Element => {
  const wrapClickHandler = (func: undefined | (() => void)) => {
    if (!func) {
      return undefined;
    }
    return async () => {
      await func();
      onClose();
    };
  };

  const _onPreview = wrapClickHandler(onPreview);
  const _onEdit = wrapClickHandler(onEdit);
  const _onDelete = wrapClickHandler(onDelete);
  const _onDownload = wrapClickHandler(onDownload);

  return (
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
      {_onPreview ? (
        <FileMenuItem
          onClick={_onPreview}
          icon={<PageviewIcon />}
          text="Preview"
        />
      ) : null}

      {_onEdit ? (
        <RenderToggleByAction required="metadata:write:update">
          <FileMenuItem onClick={_onEdit} icon={<EditIcon />} text="Edit" />
        </RenderToggleByAction>
      ) : null}

      {_onDelete ? (
        <RenderToggleByAction required="metadata:write:delete">
          <FileMenuItem
            onClick={_onDelete}
            icon={<DeleteIcon />}
            text="Delete"
          />
        </RenderToggleByAction>
      ) : null}

      {_onDownload ? (
        <FileMenuItem
          onClick={_onDownload}
          icon={<FileDownloadIcon />}
          text="Download"
        />
      ) : null}
    </Menu>
  );
};
export { Component as FileMenu };
export type { ComponentProps as FileMenuProps };
