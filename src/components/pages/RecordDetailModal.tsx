import {
  TabBar,
  Spacer,
  metaStore,
  API_ROUTE,
  ErrorMessage,
  LoadingIndicator,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import { FileList } from "../organisms/FileList";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { RecordDetailModalToolBar } from "components/molecules/RecordDetailModalToolBar";
import { RecordInfo } from "components/organisms/RecordInfo";
import useSWR, { mutate } from "swr";
import { useAuth0 } from "@auth0/auth0-react";
import { RecordEditModal } from "components/pages/RecordEditModal";
import { usePrevious } from "../../utils/index";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  recordId: string;
  databaseId: string;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    padding: "10px",
  },
  title: {
    fontSize: "1.5rem",
    marginLeft: "3vw",
  },
  bodyContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    overflow: "auto",
  },
  tabBarContainer: {
    flex: 0,
  },
  mainContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    overflow: "auto",
  },
  mainListContainer: {
    flex: 1,
    overflow: "auto",
  },
  ToolBarContainer: {
    padding: "5px",
  },
});

const Container = ({
  open,
  onClose,
  databaseId,
  recordId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently } = useAuth0();
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [isRecordEditModalOpen, setIsRecordEditModalOpen] = useState(false);

  const initializeState = () => {
    setTab(0);
    setIsRecordEditModalOpen(false);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const getRecordURL = `${API_ROUTE.META.BASE}/databases/${databaseId}/records/${recordId}`;
  const getRecord = async () => {
    metaStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    const listRecordsRes = await metaStore.RecordService.getRecord(
      recordId,
      databaseId
    );
    return listRecordsRes;
  };
  const { data: getRecordRes, error: getRecordError } = useSWR(
    getRecordURL,
    getRecord
  );

  const listFilesURL = `${API_ROUTE.META.BASE}/databases/${databaseId}/records/${recordId}/files`;
  const listFiles = async () => {
    metaStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    // TODO: Fix API
    const listFilesRes = await metaStore.FileService.listFiles(
      databaseId,
      recordId
    );
    return listFilesRes;
  };
  const { data: listFilesRes, error: listFilesError } = useSWR(
    listFilesURL,
    listFiles
  );
  const onChangeTab = (tabNum: number) => setTab(tabNum);
  const tabNames = ["Info", "Files"];

  // ! this is dummy func
  // TODO: implement method
  const onPreviewFile = (file: metaStore.FileModel) =>
    window.alert(`preview: ${JSON.stringify(file)}`);
  const onEditFile = (file: metaStore.FileModel) =>
    window.alert(`edit: ${JSON.stringify(file)}`);
  const onDeleteFile = (file: metaStore.FileModel) =>
    window.alert(`delete: ${JSON.stringify(file)}`);
  const onDownloadFile = (file: metaStore.FileModel) =>
    window.alert(`download: ${JSON.stringify(file)}`);

  const onAddFile = () => window.alert("add File");
  const onEditRecord = () => setIsRecordEditModalOpen(true);

  const title = getRecordRes?.["record name"] || getRecordRes?.record_id;
  return (
    <Dialog open={open} fullWidth maxWidth="xl" onClose={onClose}>
      <div className={classes.root}>
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
                <div className={classes.title}>{title}</div>
                <Spacer direction="vertical" size="2vh" />
              </>
            )}
            <div className={classes.bodyContainer}>
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
                      // @ts-expect-error this is API bug!
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
            </div>
            <RecordDetailModalToolBar
              onClickAddFile={onAddFile}
              onClickEditRecord={onEditRecord}
            />
            <RecordEditModal
              databaseId={databaseId}
              recordId={recordId}
              open={isRecordEditModalOpen}
              onClose={() => setIsRecordEditModalOpen(false)}
              onSaveSucceeded={(newRecord) => mutate(getRecordURL, newRecord)}
            />
          </>
        )}
      </div>
    </Dialog>
  );
};

export { Container as RecordDetailModal };
export type { ContainerProps as RecordDetailModalProps };
