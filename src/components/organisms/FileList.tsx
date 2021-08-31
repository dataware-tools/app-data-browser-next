import { useAuth0 } from "@auth0/auth0-react";
import {
  alert,
  API_ROUTE,
  confirm,
  ErrorMessage,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
  fileProvider,
  LoadingIndicator,
  metaStore,
} from "@dataware-tools/app-common";
import List from "@material-ui/core/List";
import { useState, useMemo } from "react";
import { FileEditModal, FileEditModalProps } from "./FileEditModal";
import {
  FileListItem,
  FileListItemProps,
} from "components/organisms/FileListItem";
import {
  FilePreviewModal,
  FilePreviewModalProps,
} from "components/organisms/FilePreviewModal";
import {
  useListFiles,
  fetchFileProvider,
  fetchMetaStore,
  getFileName,
} from "utils";

export type FileListPresentationProps = {
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
} & FileListProps;

export type FileListProps = {
  databaseId: string;
  recordId: string;
};

export const FileListPresentation = ({
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
}: FileListPresentationProps): JSX.Element => {
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
              fileList={files}
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

export const FileList = ({
  databaseId,
  recordId,
}: FileListProps): JSX.Element => {
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
        confirmMode: "delete",
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
  const files = useMemo(
    () =>
      listFilesRes?.data
        .filter(
          (file) =>
            file.path != null &&
            file.path !== "" &&
            file.path !== "/" &&
            file.path !== "/."
        )
        .map((file) => ({
          ...file,
          displayPath: getFileName(file.path),
        })) || [],
    [listFilesRes]
  );
  const error: FileListPresentationProps["error"] = listFilesError
    ? extractErrorMessageFromFetchError(listFilesError)
    : undefined;
  const isFetchComplete = Boolean(!error && listFilesRes);

  return (
    <FileListPresentation
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
