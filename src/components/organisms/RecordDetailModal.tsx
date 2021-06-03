import {
  TabBar,
  Spacer,
  metaStore,
  ErrorMessage,
  LoadingIndicator,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import { FileList } from "./FileList";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { RecordInfo } from "components/organisms/RecordInfo";
import { mutate } from "swr";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchAPI, useGetRecord, useListFiles, usePrevious } from "utils/index";
import { RecordEditModal } from "components/organisms/RecordEditModal";
import {
  FileUploadButton,
  FileUploadButtonProps,
} from "components/atoms/FileUploadButton";
import UploadIcon from "@material-ui/icons/Upload";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import { DialogContainer } from "components/atoms/DialogContainer";
import { DialogTitle } from "components/atoms/DialogTitle";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogToolBar } from "components/atoms/DialogToolBar";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  recordId: string;
  databaseId: string;
};

const useStyles = makeStyles({
  tabBarContainer: {
    flex: 0,
  },
  mainContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    overflow: "auto",
  },
});

const Container = ({
  open,
  onClose,
  databaseId,
  recordId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [isRecordEditModalOpen, setIsRecordEditModalOpen] = useState(false);
  const [isAddingFile, setIsAddingFile] = useState(false);

  const initializeState = () => {
    setTab(0);
    setIsRecordEditModalOpen(false);
    setIsAddingFile(false);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

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

  const onChangeTab = (tabNum: number) => setTab(tabNum);
  const tabNames = ["Info", "Files"];

  // ! this is dummy func
  // TODO: implement method
  const onPreviewFile = (file: metaStore.FileModel) =>
    window.alert(`preview: ${JSON.stringify(file)}`);
  const onEditFile = (file: metaStore.FileModel) =>
    window.alert(`edit: ${JSON.stringify(file)}`);

  const onDeleteFile = async (file: metaStore.FileModel) => {
    if (!window.confirm("Are you sure you want to delete file?")) return;

    const [deleteFileRes] = await fetchAPI(
      getAccessToken,
      metaStore.FileService.deleteFile,
      {
        databaseId,
        uuid: file.uuid,
      }
    );

    if (deleteFileRes) {
      // @ts-expect-error fix API
      const newFiles = listFilesRes.data.filter((oldFile) => {
        return oldFile.uuid !== deleteFileRes.uuid;
      });
      const newListFilesRes = { ...listFilesRes };
      newListFilesRes.data = newFiles;

      mutate(listFilesCacheKey, newListFilesRes, false);
    }
  };

  const onDownloadFile = (file: metaStore.FileModel) =>
    window.alert(`download: ${JSON.stringify(file)}`);

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

    const [createFileRes] = await fetchAPI(
      getAccessToken,
      metaStore.FileService.createFile,
      {
        databaseId,
        requestBody: {
          record_id: recordId,
          path: files[0].name,
          description: "this is file creating test",
        },
      }
    );

    if (createFileRes) {
      const newFileList = { ...listFilesRes };
      // @ts-expect-error fix API
      newFileList.data.push(createFileRes);

      mutate(listFilesCacheKey, newFileList, false);
    }
    // TODO: add file uploading process
    setIsAddingFile(false);
  };

  const onEditRecord = () => setIsRecordEditModalOpen(true);

  const title = getRecordRes?.["record name"] || getRecordRes?.record_id;
  return (
    <Dialog open={open} fullWidth maxWidth="xl" onClose={onClose}>
      <DialogContainer>
        <DialogCloseButton onClick={onClose} />
        {getRecordError || listFilesError ? (
          <ErrorMessage
            reason={JSON.stringify(getRecordError || listFilesError)}
            instruction="please reload this page"
          />
        ) : (
          <>
            {title && (
              <>
                <DialogTitle>
                  <Spacer direction="horizontal" size="3vw" />
                  {title}
                </DialogTitle>
              </>
            )}
            <Spacer direction="vertical" size="2vh" />
            <DialogBody>
              <div className={classes.tabBarContainer}>
                <TabBar
                  onChange={onChangeTab}
                  tabNames={tabNames}
                  value={tab}
                />
              </div>
              <div className={classes.mainContainer}>
                {tabNames[tab] === "Info" ? (
                  getRecordRes ? (
                    <RecordInfo record={getRecordRes} />
                  ) : (
                    <LoadingIndicator />
                  )
                ) : tabNames[tab] === "Files" ? (
                  listFilesRes ? (
                    <FileList
                      files={listFilesRes.data}
                      onPreview={onPreviewFile}
                      onDownload={onDownloadFile}
                      onEdit={onEditFile}
                      onDelete={onDeleteFile}
                    />
                  ) : (
                    <LoadingIndicator />
                  )
                ) : null}
              </div>
            </DialogBody>
            <DialogToolBar
              right={
                <>
                  <FileUploadButton
                    onFileChange={onAddFile}
                    startIcon={<UploadIcon />}
                    pending={isAddingFile}
                  >
                    Add File
                  </FileUploadButton>
                  <Spacer direction="horizontal" size="10px" />
                  <Button onClick={onEditRecord} startIcon={<EditIcon />}>
                    Edit Record
                  </Button>
                </>
              }
            />
            <RecordEditModal
              databaseId={databaseId}
              recordId={recordId}
              open={isRecordEditModalOpen}
              onClose={() => setIsRecordEditModalOpen(false)}
              onSubmitSucceeded={(newRecord) =>
                mutate(getRecordCacheKey, newRecord)
              }
            />
          </>
        )}
      </DialogContainer>
    </Dialog>
  );
};

export { Container as RecordDetailModal };
export type { ContainerProps as RecordDetailModalProps };
