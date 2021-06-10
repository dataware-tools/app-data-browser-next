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

type ComponentProps = DialogProps & {
  downloadURL: string | undefined | null;
  file: FileType;
  height?: string;
};

type ContainerProps = DialogProps & {
  file: FileType;
  height?: string;
};

const Component = ({
  downloadURL,
  file,
  height,
  ...dialogProps
}: ComponentProps): JSX.Element => {
  return (
    <Dialog {...dialogProps}>
      <DialogContainer height={height}>
        <DialogBody>
          {downloadURL === undefined ? (
            <LoadingIndicator />
          ) : downloadURL === null ? (
            "Failed to get download-link"
          ) : (
            <FilePreviewer file={file} url={downloadURL} />
          )}
        </DialogBody>
      </DialogContainer>
    </Dialog>
  );
};

const Container = ({ file, ...delegated }: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [downloadURL, setDownloadURL] = useState<string | undefined | null>(
    undefined
  );

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
          setDownloadURL(null);
        });
    });
  }

  return <Component downloadURL={downloadURL} file={file} {...delegated} />;
};

export {
  Container as FilePreviewModal,
  Component as FilePreviewModalComponent,
};
export type {
  ContainerProps as FilePreviewModalProps,
  ComponentProps as FilePreviewModalComponentProps,
};
