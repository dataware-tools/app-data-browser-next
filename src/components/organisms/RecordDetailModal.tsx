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
} from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import { FileList } from "components/organisms/FileList";
import { RecordInfo } from "components/organisms/RecordInfo";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useGetRecord,
  useListFiles,
  uploadFileToFileProvider,
  useGetConfig,
  createSystemMetadata,
} from "utils";
import {
  RecordEditModal,
  RecordEditModalProps,
} from "components/organisms/RecordEditModal";
import UploadIcon from "@material-ui/icons/Upload";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import { produce } from "immer";
import { RenderToggleByAction } from "components/atoms/RenderToggleByAction";

type Props = {
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
  isOpenRecordEditModal,
  isAddingFile,
  onCloseRecordEditModal,
  onAddFile,
  onEditRecord,
}: Props) => {
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
  const { getAccessTokenSilently: getAccessToken, user } = useAuth0();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isOpenRecordEditModal, setIsOpenRecordEditModal] = useState(false);
  const [isAddingFile, setIsAddingFile] = useState(false);

  const { data: getRecordRes } = useGetRecord(getAccessToken, {
    databaseId,
    recordId,
  });

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
      new Blob([JSON.stringify(createSystemMetadata("add", user))], {
        type: "application/json",
      })
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
        title: `Fail to upload: ${JSON.stringify(createFileError)}`,
      });
      setIsAddingFile(false);
      return;
    }

    if (createFileRes && listFilesRes) {
      const newListFilesRes = produce(listFilesRes, (draft) => {
        draft.data.push(createFileRes);
      });

      listFilesMutate(newListFilesRes, false);
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
    <Component
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
export { Container as RecordDetailModal };
export type { ContainerProps as RecordDetailModalProps };
