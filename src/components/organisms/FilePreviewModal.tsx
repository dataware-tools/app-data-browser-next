import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import { DialogBody, DialogContainer } from "@dataware-tools/app-common";
import { FileType } from "components/organisms/FileListItem";
import { FileDownloadURLInjector } from "./FileDownloadUrlInjector";
import { FilePreviewer } from "components/molecules/FilePreviewer";

type ContainerWithDialogProps = DialogProps & {
  file: FileType;
  height?: string;
};

const Component = ({
  file,
  height,
  ...dialogProps
}: ContainerWithDialogProps): JSX.Element => {
  return (
    <Dialog {...dialogProps}>
      <DialogContainer height={height}>
        <DialogBody>
          <FileDownloadURLInjector
            file={file}
            render={(file, url) => {
              return <FilePreviewer file={file} url={url} />;
            }}
          />
        </DialogBody>
      </DialogContainer>
    </Dialog>
  );
};

export { Component as FilePreviewModal };
export type { ContainerWithDialogProps as FilePreviewModalProps };
