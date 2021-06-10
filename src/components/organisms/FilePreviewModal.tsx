import {
  LoadingIndicator,
  fileProvider,
  API_ROUTE,
} from "@dataware-tools/app-common";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import React, { useState } from "react";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogContainer } from "components/atoms/DialogContainer";
import { useAuth0 } from "@auth0/auth0-react";
import { FileType } from "components/organisms/FileListItem";
import { FilePreviewer } from "components/molecules/FilePreviewer";

type ComponentProps = {
  downloadURL: string;
  file: FileType;
};

type ContainerProps = {
  file: FileType;
};

type ContainerWithDialogProps = DialogProps & {
  file: FileType;
  height?: string;
};

const Component = ({ downloadURL, file }: ComponentProps): JSX.Element => {
  return <FilePreviewer file={file} url={downloadURL} />;
};

const Container = ({ file }: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [downloadURL, setDownloadURL] = useState<string | undefined>(undefined);
  const [isFetchFailed, setIsFetchFailed] = useState<boolean>(false);

  if (file.path) {
    // TODO: Move the following fetcher to app-common
    getAccessToken().then((accessToken: string) => {
      fileProvider.OpenAPI.TOKEN = accessToken;
      fileProvider.OpenAPI.BASE = API_ROUTE.FILE.BASE;
      fileProvider.DownloadService.createJwtToDownloadFile({
        requestBody: {
          path: file.path,
          content_type: file["content-type"],
        },
      })
        .then((res: fileProvider.DownloadsPostedModel) => {
          setDownloadURL(API_ROUTE.FILE.BASE + "/download/" + res.token);
        })
        .catch(() => {
          setIsFetchFailed(true);
        });
    });
  }

  return (
    <>
      {isFetchFailed ? (
        <p>Fetch failed</p>
      ) : downloadURL ? (
        <Component downloadURL={downloadURL} file={file} />
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

const ContainerWithDialog = ({
  file,
  height,
  ...dialogProps
}: ContainerWithDialogProps): JSX.Element => {
  return (
    <Dialog {...dialogProps}>
      <DialogContainer height={height}>
        <DialogBody>
          <Container file={file} />
        </DialogBody>
      </DialogContainer>
    </Dialog>
  );
};

export {
  ContainerWithDialog as FilePreviewModal,
  Container as FilePreviewModalContainer,
  Component as FilePreviewModalComponent,
};
export type {
  ContainerWithDialogProps as FilePreviewModalProps,
  ContainerProps as FilePreviewModalContainerProps,
  ComponentProps as FilePreviewModalComponentProps,
};
