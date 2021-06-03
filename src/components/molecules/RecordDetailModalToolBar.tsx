import { ToolBar, Spacer } from "@dataware-tools/app-common";
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import UploadIcon from "@material-ui/icons/Upload";

type ComponentProps = {
  onClickAddFile: () => void;
  onClickEditRecord: () => void;
};
const Component = ({
  onClickAddFile,
  onClickEditRecord,
}: ComponentProps): JSX.Element => (
  <ToolBar
    right={
      <>
        {" "}
        <Button onClick={onClickAddFile} startIcon={<UploadIcon />}>
          Add File
        </Button>
        <Spacer direction="horizontal" size="10px" />
        <Button onClick={onClickEditRecord} startIcon={<EditIcon />}>
          Edit Record
        </Button>
      </>
    }
  />
);

export { Component as RecordDetailModalToolBar };
export type { ComponentProps as RecordDetailModalToolBarProps };
