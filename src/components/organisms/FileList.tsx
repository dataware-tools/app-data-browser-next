import {
  FileListItem,
  FileListItemProps,
} from "components/organisms/FileListItem";
import List from "@material-ui/core/List";
import {
  FilePreviewModal,
  FilePreviewModalProps,
} from "components/organisms/FilePreviewModal";
import { useListFiles, fetchFileProvider, fetchMetaStore } from "utils";
import { useAuth0 } from "@auth0/auth0-react";
import {
  alert,
  API_ROUTE,
  confirm,
  ErrorMessage,
  ErrorMessageProps,
  fileProvider,
  LoadingIndicator,
  metaStore,
} from "@dataware-tools/app-common";
import { useState } from "react";
import { FileEditModal, FileEditModalProps } from "./FileEditModal";

type Props = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  files: FileListItemProps["file"][];
  onPreview: FileListItemProps["onPreview"];
  onDelete: FileListItemProps["onDelete"];
  onEdit: FileListItemProps["onEdit"];
  onDownload: FileListItemProps["onDownload"];
  previewingFile?: FilePreviewModalProps["file"];
  onCloseFilePreviewModal: FilePreviewModalProps["onClose"];
  onCloseFileEditModal: FileEditModalProps["onClose"];
  editingFile?: metaStore.FileModel;
} & ContainerProps;

type ContainerProps = {
  databaseId: string;
  recordId: string;
};

const Component = ({
  files,
  isFetchComplete,
  error,
  previewingFile,
  onCloseFilePreviewModal,
  databaseId,
  recordId,
  editingFile,
  onCloseFileEditModal,
  ...delegated
}: Props): JSX.Element => {
  return (
    <>
      {error ? (
        <ErrorMessage {...error} />
      ) : isFetchComplete ? (
        <>
          <List>
            {files.map((file) => {
              return (
                <FileListItem key={file.path} file={file} {...delegated} />
              );
            })}
          </List>
          {previewingFile ? (
            <FilePreviewModal
              open={Boolean(previewingFile)}
              onClose={onCloseFilePreviewModal}
              file={previewingFile}
              fullWidth
              maxWidth="md"
              height="auto"
            />
          ) : null}
          {editingFile ? (
            <FileEditModal
              open={Boolean(editingFile)}
              databaseId={databaseId}
              recordId={recordId}
              onClose={onCloseFileEditModal}
              uuid={editingFile.uuid}
            />
          ) : null}
        </>
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

const Container = ({ databaseId, recordId }: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [previewingFile, setPreviewingFile] = useState<
    metaStore.FileModel | undefined
  >(undefined);
  const [editingFile, setEditingFile] = useState<
    metaStore.FileModel | undefined
  >(undefined);

  const {
    data: listFilesRes,
    error: listFilesError,
    mutate: listFilesMutate,
  } = useListFiles(getAccessToken, {
    databaseId,
    recordId,
  });

  const onPreview = (file: metaStore.FileModel) => {
    setPreviewingFile(file);
  };

  const onEdit = (file: metaStore.FileModel) => {
    setEditingFile(file);
  };

  const onDelete = async (file: metaStore.FileModel) => {
    if (
      !(await confirm({
        title: "Are you sure you want to delete file?",
      }))
    )
      return;

    const [, deleteFileEntityError] = await fetchFileProvider(
      getAccessToken,
      fileProvider.DeleteService.deleteFile,
      {
        path: file.path,
      }
    );

    if (deleteFileEntityError) {
      await alert({
        title: `Error occur! : ${JSON.stringify(deleteFileEntityError)}`,
      });
      return;
    }

    const [deleteFileMetaRes, deleteFileMetaError] = await fetchMetaStore(
      getAccessToken,
      metaStore.FileService.deleteFile,
      {
        databaseId,
        uuid: file.uuid,
      }
    );

    if (deleteFileMetaError) {
      await alert({
        title: `Error occur! : ${JSON.stringify(deleteFileMetaError)}`,
      });
      return;
    }

    if (deleteFileMetaRes && listFilesRes) {
      const newFiles = listFilesRes.data.filter((oldFile) => {
        return oldFile.uuid !== deleteFileMetaRes.uuid;
      });
      const newListFilesRes = { ...listFilesRes };
      newListFilesRes.data = newFiles;

      listFilesMutate(newListFilesRes, false);
    }
  };

  const onDownload = (file: metaStore.FileModel) => {
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
          window.open(API_ROUTE.FILE.BASE + "/download/" + res.token, "_blank");
        })
        .catch((e) => {
          alert({ title: "Failed to download the file: " + e });
        });
    });
  };

  const onCloseFilePreviewModal = () => setPreviewingFile(undefined);
  const onCloseFileEditModal = () => setEditingFile(undefined);
  const files = listFilesRes?.data || [];
  const error: Props["error"] = listFilesError
    ? {
        reason: JSON.stringify(listFilesError),
        instruction: "Please reload this page",
      }
    : undefined;
  const isFetchComplete = Boolean(!error && listFilesRes);

  return (
    <Component
      databaseId={databaseId}
      recordId={recordId}
      error={error}
      isFetchComplete={isFetchComplete}
      files={files}
      onEdit={onEdit}
      onPreview={onPreview}
      onDelete={onDelete}
      onDownload={onDownload}
      previewingFile={previewingFile}
      onCloseFilePreviewModal={onCloseFilePreviewModal}
      editingFile={editingFile}
      onCloseFileEditModal={onCloseFileEditModal}
    />
  );
};

export { Container as FileList };
export type { ContainerProps as FileListProps };
