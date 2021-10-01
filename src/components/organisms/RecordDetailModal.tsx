import { useAuth0 } from "@auth0/auth0-react";
import {
  Spacer,
  ErrorMessage,
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
  confirm,
  alert,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import EditIcon from "@mui/icons-material/Edit";
import UploadIcon from "@mui/icons-material/Upload";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { produce } from "immer";
import { useState, useEffect } from "react";
import { RenderToggleByAction } from "components/atoms/RenderToggleByAction";
import { FileList } from "components/organisms/FileList";
import {
  RecordEditModal,
  RecordEditModalProps,
} from "components/organisms/RecordEditModal";
import { RecordInfo } from "components/organisms/RecordInfo";
import {
  useGetRecord,
  useListFiles,
  uploadFileToFileProvider,
  useGetConfig,
  createSystemMetadata,
} from "utils";

export type RecordDetailModalPresentationProps = {
  title?: string;
  onChangeTab: DialogTabBarProps["onChange"];
  tabNames: DialogTabBarProps["tabNames"];
  selectedTabIndex: DialogTabBarProps["value"];
  error?: ErrorMessageProps;
  isOpenRecordEditModal: boolean;
  isAddingFile: boolean;
  onCloseRecordEditModal: RecordEditModalProps["onClose"];
  onAddFile: FileUploadButtonProps["onFileChange"];
  onEditRecord: () => void;
} & RecordDetailModalProps;

export type RecordDetailModalProps = {
  open: boolean;
  onClose: () => void;
  recordId: string;
  databaseId: string;
};

export const RecordDetailModalPresentation = ({
  open,
  onClose,
  recordId,
  databaseId,
  title,
  onChangeTab,
  tabNames,
  selectedTabIndex,
  error,
  isOpenRecordEditModal,
  isAddingFile,
  onCloseRecordEditModal,
  onAddFile,
  onEditRecord,
}: RecordDetailModalPresentationProps): JSX.Element => {
  const currentTabName = tabNames[selectedTabIndex];
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
              <DialogBody
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DialogMain width="60vw">
                  {currentTabName === "Info" ? (
                    <RecordInfo databaseId={databaseId} recordId={recordId} />
                  ) : currentTabName === "Files" ? (
                    <FileList databaseId={databaseId} recordId={recordId} />
                  ) : null}
                </DialogMain>
              </DialogBody>
              <RecordEditModal
                databaseId={databaseId}
                recordId={recordId}
                open={isOpenRecordEditModal}
                onClose={onCloseRecordEditModal}
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
                  loading={isAddingFile}
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

export const RecordDetailModal = ({
  open,
  onClose,
  databaseId,
  recordId,
}: RecordDetailModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken, user } = useAuth0();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isOpenRecordEditModal, setIsOpenRecordEditModal] = useState(false);
  const [isAddingFile, setIsAddingFile] = useState(false);

  const { data: getRecordRes, mutate: getRecordMutate } = useGetRecord(
    getAccessToken,
    {
      databaseId,
      recordId,
    }
  );

  const { data: listFilesRes, mutate: listFilesMutate } = useListFiles(
    getAccessToken,
    {
      databaseId,
      recordId,
    }
  );

  const { data: getConfigRes } = useGetConfig(getAccessToken, {
    databaseId,
  });

  const initializeState = () => {
    setSelectedTabIndex(0);
    setIsOpenRecordEditModal(false);
    setIsAddingFile(false);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const tabNames = ["Info", "Files"];

  const onAddFile: FileUploadButtonProps["onFileChange"] = async (files) => {
    if (!user || !user.sub) return;

    if (!files || !files[0]) {
      return;
    }
    if (
      !(await confirm({
        title: `Are you sure you want to upload file: ${files[0].name} ?`,
      }))
    ) {
      return;
    }

    setIsAddingFile(true);

    const requestBody = new FormData();
    requestBody.append("file", files[0]);
    requestBody.append(
      "metadata",
      new Blob(
        [JSON.stringify(createSystemMetadata("add", { sub: user.sub }))],
        {
          type: "application/json",
        }
      )
    );

    const [createFileRes, createFileError] = await uploadFileToFileProvider(
      getAccessToken,
      {
        databaseId,
        recordId,
        requestBody,
      }
    );

    if (createFileError) {
      await alert({
        title: "Fail to upload",
        body: extractErrorMessageFromFetchError(createFileError).reason,
      });
      setIsAddingFile(false);
      return;
    }

    if (createFileRes && listFilesRes) {
      const newListFilesRes = produce(listFilesRes, (draft) => {
        draft.data.push(createFileRes);
      });

      listFilesMutate(newListFilesRes, false);
      getRecordMutate();
    }

    setIsAddingFile(false);
  };

  const onCloseRecordEditModal = () => setIsOpenRecordEditModal(false);

  const onEditRecord = () => setIsOpenRecordEditModal(true);
  const titleColumn = getConfigRes?.columns.find(
    (column) => column.is_record_title
  )?.name;
  const title = titleColumn ? getRecordRes?.[titleColumn] : "No title";

  return (
    <RecordDetailModalPresentation
      onEditRecord={onEditRecord}
      databaseId={databaseId}
      isAddingFile={isAddingFile}
      isOpenRecordEditModal={isOpenRecordEditModal}
      onAddFile={onAddFile}
      onChangeTab={setSelectedTabIndex}
      onClose={onClose}
      onCloseRecordEditModal={onCloseRecordEditModal}
      open={open}
      recordId={recordId}
      selectedTabIndex={selectedTabIndex}
      tabNames={tabNames}
      title={title}
    />
  );
};
