import {
  LoadingIndicator,
  fileProvider,
  API_ROUTE,
} from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import React, { useState, useEffect } from "react";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogContainer } from "components/atoms/DialogContainer";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth0 } from "@auth0/auth0-react";
import { FileType } from "./FileListItem";

type ComponentProps = {
  open: boolean;
  onClose: () => void;
  downloadURL: string | undefined | null;
  file: FileType;
};

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  file: FileType;
};

const useStyles = makeStyles({
  body: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    width: "100%",
  },
});

const Component = ({
  open,
  onClose,
  downloadURL,
  file,
}: ComponentProps): JSX.Element => {
  const styles = useStyles();

  const getPreviewComponent = (file: FileType) => {
    return <>{file.path}</>;
  };

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer height="auto">
        <DialogBody>
          <div className={styles.body}>
            {downloadURL === undefined ? (
              <LoadingIndicator />
            ) : downloadURL === null ? (
              <>Failed to get donwload-link</>
            ) : (
              <>{getPreviewComponent(file)}</>
            )}
          </div>
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

  useEffect(() => {
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
  }, []);

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
