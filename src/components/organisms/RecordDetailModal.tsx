import {
  Spacer,
  metaStore,
  ErrorMessage,
  LoadingIndicator,
  fileProvider,
  API_ROUTE,
  DialogTitle,
  DialogCloseButton,
  DialogContainer,
  DialogBody,
  DialogToolBar,
  FileUploadButton,
  FileUploadButtonProps,
  DialogWrapper,
  DialogTabBar,
  DialogMain,
  usePrevious,
  DialogTabBarProps,
  ErrorMessageProps,
} from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import { FileList, FileListProps } from "components/organisms/FileList";
import { RecordInfo, RecordInfoProps } from "components/organisms/RecordInfo";
import { mutate } from "swr";
import { useAuth0 } from "@auth0/auth0-react";
import {
  fetchMetaStore,
  useGetRecord,
  useListFiles,
  uploadFileToFileProvider,
  fetchFileProvider,
  useGetConfig,
  DatabaseConfigType,
} from "utils";
import {
  RecordEditModal,
  RecordEditModalProps,
} from "components/organisms/RecordEditModal";
import UploadIcon from "@material-ui/icons/Upload";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import { produce } from "immer";
import {
  FilePreviewModal,
  FilePreviewModalProps,
} from "components/organisms/FilePreviewModal";
import { RenderToggleByAction } from "components/atoms/RenderToggleByAction";

type Props = {
  title?: string;
  onChangeTab: DialogTabBarProps["onChange"];
  tabNames: DialogTabBarProps["tabNames"];
  selectedTabIndex: DialogTabBarProps["value"];
  error?: ErrorMessageProps;
  recordDetail?: RecordInfoProps["record"];
  files?: FileListProps["files"];
  isOpenRecordEditModal: boolean;
  previewingFile?: FilePreviewModalProps["file"];
  isAddingFile: boolean;
  onPreviewFile: FileListProps["onPreview"];
  onDownloadFile: FileListProps["onDownload"];
  onEditFile: FileListProps["onEdit"];
  onDeleteFile: FileListProps["onDelete"];
  onCloseRecordEditModal: RecordEditModalProps["onClose"];
  onEditRecordSucceeded: RecordEditModalProps["onSubmitSucceeded"];
  onCloseFilePreviewModal: FilePreviewModalProps["onClose"];
  onAddFile: FileUploadButtonProps["onFileChange"];
  onEditRecord: () => void;
} & ContainerProps;

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  recordId: string;
  databaseId: string;
};

const Component = ({
  open,
  onClose,
  recordId,
  databaseId,
  title,
  onChangeTab,
  tabNames,
  selectedTabIndex,
  error,
  recordDetail,
  files,
  isOpenRecordEditModal,
  previewingFile,
  isAddingFile,
  onPreviewFile,
  onDownloadFile,
  onEditFile,
  onDeleteFile,
  onCloseRecordEditModal,
  onEditRecordSucceeded,
  onCloseFilePreviewModal,
  onAddFile,
  onEditRecord,
}: Props) => {
  const currentTabName = tabNames[selectedTabIndex];
  return (
    <Dialog open={open} fullWidth maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContainer height="60vh">
          <DialogTabBar
            onChange={onChangeTab}
            tabNames={tabNames}
            value={selectedTabIndex}
          />
          {error ? (
            <ErrorMessage {...error} />
          ) : (
            <>
              <DialogBody>
                <DialogMain>
                  {currentTabName === "Info" ? (
                    recordDetail ? (
                      <RecordInfo record={recordDetail} />
                    ) : (
                      <LoadingIndicator />
                    )
                  ) : currentTabName === "Files" ? (
                    files ? (
                      <FileList
                        files={files}
                        onPreview={onPreviewFile}
                        onDownload={onDownloadFile}
                        onEdit={onEditFile}
                        onDelete={onDeleteFile}
                      />
                    ) : (
                      <LoadingIndicator />
                    )
                  ) : null}
                </DialogMain>
              </DialogBody>
              <RecordEditModal
                databaseId={databaseId}
                recordId={recordId}
                open={isOpenRecordEditModal}
                onClose={onCloseRecordEditModal}
                onSubmitSucceeded={onEditRecordSucceeded}
              />
              <FilePreviewModal
                open={Boolean(previewingFile)}
                onClose={onCloseFilePreviewModal}
                file={previewingFile || {}}
                fullWidth
                maxWidth="md"
                height="auto"
              />
            </>
          )}
        </DialogContainer>
        <DialogToolBar
          right={
            <>
              <RenderToggleByAction required="metadata:write:add">
                <FileUploadButton
                  onFileChange={onAddFile}
                  startIcon={<UploadIcon />}
                  pending={isAddingFile}
                >
                  Add File
                </FileUploadButton>
              </RenderToggleByAction>
              <Spacer direction="horizontal" size="10px" />
              <RenderToggleByAction required="metadata:write:update">
                <Button onClick={onEditRecord} startIcon={<EditIcon />}>
                  Edit Record
                </Button>
              </RenderToggleByAction>
            </>
          }
        />
      </DialogWrapper>
    </Dialog>
  );
};

const Container = ({
  open,
  onClose,
  databaseId,
  recordId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [isOpenRecordEditModal, setIsOpenRecordEditModal] = useState(false);
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [previewingFile, setPreviewingFile] = useState<
    metaStore.FileModel | undefined
  >(undefined);

  const [getRecordRes, getRecordError, getRecordCacheKey] = useGetRecord(
    getAccessToken,
    {
      databaseId,
      recordId,
    }
  );
  const [listFilesRes, listFilesError, listFilesCacheKey] = useListFiles(
    getAccessToken,
    {
      databaseId,
      recordId,
    }
  );
  const [getConfigRes] = (useGetConfig(getAccessToken, {
    databaseId,
  }) as unknown) as [data: DatabaseConfigType | undefined];

  const fetchError = getRecordError || listFilesError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: JSON.stringify(fetchError),
        instruction: "Please reload this page",
      });
    }
  }, [fetchError]);

  const initializeState = () => {
    setSelectedTabIndex(0);
    setIsOpenRecordEditModal(false);
    setIsAddingFile(false);
    setPreviewingFile(undefined);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const tabNames = ["Info", "Files"];

  const onPreviewFile = (file: metaStore.FileModel) => {
    setPreviewingFile(file);
  };

  // ! this is dummy func
  // TODO: implement method
  const onEditFile = (file: metaStore.FileModel) =>
    window.alert(`edit: ${JSON.stringify(file)}`);

  const onDeleteFile = async (file: metaStore.FileModel) => {
    if (!window.confirm("Are you sure you want to delete file?")) return;

    const [, deleteFileEntityError] = await fetchFileProvider(
      getAccessToken,
      fileProvider.DeleteService.deleteFile,
      {
        path: file.path,
      }
    );

    if (deleteFileEntityError) {
      window.alert(`Error occur! : ${JSON.stringify(deleteFileEntityError)}`);
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
      window.alert(`Error occur! : ${JSON.stringify(deleteFileMetaError)}`);
      return;
    }

    if (deleteFileMetaRes && listFilesRes) {
      const newFiles = listFilesRes.data.filter((oldFile) => {
        return oldFile.uuid !== deleteFileMetaRes.uuid;
      });
      const newListFilesRes = { ...listFilesRes };
      newListFilesRes.data = newFiles;

      mutate(listFilesCacheKey, newListFilesRes, false);
    }
  };

  const onDownloadFile = (file: metaStore.FileModel) => {
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
          alert("Failed to download the file: " + e);
        });
    });
  };

  const onAddFile: FileUploadButtonProps["onFileChange"] = async (files) => {
    if (!files || !files[0]) {
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to upload file: ${files[0].name} ?`
      )
    ) {
      return;
    }

    setIsAddingFile(true);

    const requestBody = new FormData();
    requestBody.append("file", files[0]);

    const [createFileRes, createFileError] = await uploadFileToFileProvider(
      getAccessToken,
      {
        databaseId,
        recordId,
        requestBody,
      }
    );

    if (createFileError) {
      window.alert(`Fail to upload: ${JSON.stringify(createFileError)}`);
      setIsAddingFile(false);
      return;
    }

    if (createFileRes && listFilesRes) {
      const newListFilesRes = produce(listFilesRes, (draft) => {
        draft.data.push(createFileRes);
      });

      mutate(listFilesCacheKey, newListFilesRes, false);
    }

    setIsAddingFile(false);
  };

  const onEditRecord = () => setIsOpenRecordEditModal(true);
  const onCloseFilePreviewModal = () => setPreviewingFile(undefined);
  const onCloseRecordEditModal = () => setIsOpenRecordEditModal(false);
  const onEditRecordSucceeded: Props["onEditRecordSucceeded"] = (newRecord) =>
    mutate(getRecordCacheKey, newRecord);

  const titleColumn = getConfigRes?.columns.find(
    (column) => column.is_record_title
  )?.name;
  const title = titleColumn ? getRecordRes?.[titleColumn] : "No title";
  const files = listFilesRes?.data;
  const recordDetail = getRecordRes;

  return (
    <Component
      databaseId={databaseId}
      error={error}
      isAddingFile={isAddingFile}
      isOpenRecordEditModal={isOpenRecordEditModal}
      onAddFile={onAddFile}
      onChangeTab={setSelectedTabIndex}
      onClose={onClose}
      onCloseFilePreviewModal={onCloseFilePreviewModal}
      onCloseRecordEditModal={onCloseRecordEditModal}
      onDeleteFile={onDeleteFile}
      onDownloadFile={onDownloadFile}
      onEditFile={onEditFile}
      onEditRecord={onEditRecord}
      onEditRecordSucceeded={onEditRecordSucceeded}
      onPreviewFile={onPreviewFile}
      open={open}
      recordId={recordId}
      selectedTabIndex={selectedTabIndex}
      tabNames={tabNames}
      files={files}
      recordDetail={recordDetail}
      title={title}
      previewingFile={previewingFile}
    />
  );
};
export { Container as RecordDetailModal };
export type { ContainerProps as RecordDetailModalProps };
