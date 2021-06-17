import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import {
  DialogBody,
  DialogContainer,
  DialogMain,
  DialogWrapper,
} from "@dataware-tools/app-common";
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
  console.log("render!!!");
  return (
    <Dialog {...dialogProps}>
      <DialogWrapper>
        <DialogContainer height={height}>
          <DialogBody>
            <DialogMain>
              <FileDownloadURLInjector
                file={file}
                render={(file, url) => {
                  return <FilePreviewer file={file} url={url} />;
                }}
              />
            </DialogMain>
          </DialogBody>
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export { Component as FilePreviewModal };
export type { ContainerWithDialogProps as FilePreviewModalProps };
