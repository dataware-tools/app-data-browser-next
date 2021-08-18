import Menu from "@material-ui/core/Menu";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FileDownloadIcon from "@material-ui/icons/FileDownload";
import PageviewIcon from "@material-ui/icons/Pageview";
import { FileMenuItem, FileMenuItemProps } from "components/atoms/FileMenuItem";
import { RenderToggleByAction } from "components/atoms/RenderToggleByAction";

type Props = ContainerProps;

type ContainerProps = {
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
}: Props): JSX.Element => {
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
      {onPreview ? (
        <FileMenuItem
          onClick={onPreview}
          icon={<PageviewIcon />}
          text="Preview"
        />
      ) : null}

      {onEdit ? (
        <RenderToggleByAction required="metadata:write:update">
          <FileMenuItem onClick={onEdit} icon={<EditIcon />} text="Edit" />
        </RenderToggleByAction>
      ) : null}

      {onDelete ? (
        <RenderToggleByAction required="metadata:write:delete">
          <FileMenuItem
            onClick={onDelete}
            icon={<DeleteIcon />}
            text="Delete"
          />
        </RenderToggleByAction>
      ) : null}

      {onDownload ? (
        <FileMenuItem
          onClick={onDownload}
          icon={<FileDownloadIcon />}
          text="Download"
        />
      ) : null}
    </Menu>
  );
};

const Container = ({
  onPreview,
  onEdit,
  onDelete,
  onDownload,
  onClose,
  ...delegate
}: ContainerProps): JSX.Element => {
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
    <Component
      {...delegate}
      onClose={onClose}
      onPreview={_onPreview}
      onEdit={_onEdit}
      onDelete={_onDelete}
      onDownload={_onDownload}
    />
  );
};
export { Container as FileMenu };
export type { ContainerProps as FileMenuProps };
