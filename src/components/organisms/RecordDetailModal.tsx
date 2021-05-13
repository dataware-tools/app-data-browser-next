import { TabBar, TabBarProps, Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { useState } from "react";
import { FileList, FileListProps } from "./FileList";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { RecordDetailModalToolBar } from "components/molecules/RecordDetailModalToolBar";
import { RecordInfo, RecordInfoProps } from "components/organisms/RecordInfo";

type Props = {
  classes: ReturnType<typeof useStyles>;
  title: string;
  tabProps: TabBarProps;
  onAddFile: () => void;
  onEditRecord: () => void;
  recordInfoProps: RecordInfoProps;
  fileListProps: FileListProps;
} & ContainerProps;

type ContainerProps = {
  open: boolean;
  onClose: () => void;
};

const Component = ({
  classes,
  open,
  title,
  tabProps,
  onClose,
  fileListProps,
  recordInfoProps,
  onAddFile,
  onEditRecord,
}: Props): JSX.Element => {
  const tab = tabProps.tabNames[tabProps.value];

  return (
    <Dialog open={open} fullWidth maxWidth="xl" onClose={onClose}>
      <div className={classes.root}>
        <DialogCloseButton onClick={onClose} />
        <div className={classes.title}>{title}</div>
        <Spacer direction="vertical" size="2vh" />
        <div className={classes.bodyContainer}>
          <div className={classes.tabBarContainer}>
            <TabBar {...tabProps} />
          </div>
          <div className={classes.mainContainer}>
            {tab === "Info" ? (
              <RecordInfo {...recordInfoProps} />
            ) : tab === "Files" ? (
              <FileList {...fileListProps} />
            ) : null}
          </div>
        </div>
        <RecordDetailModalToolBar
          onClickAddFile={onAddFile}
          onClickEditRecord={onEditRecord}
        />
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    padding: "10px",
  },
  closeButton: {
    cursor: "pointer",
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

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const onChangeTab = (tabNum: number) => setTab(tabNum);
  const tabNames = ["Info", "Files"];

  // ! this is dummy data
  // TODO: fetch record
  const record = {
    description: "Driving Database",
    database_id: "Driving Behavior Database",
    record_id: "016_00000000030000000240",
    start_timestamp: 1489728491,
    end_timestamp: 1489728570.957,
    content_type: "text/csv",
    contents: {
      "camera/front-center": {
        tags: ["camera", "front", "center", "timestamps"],
      },
    },
  };

  // ! this is dummy data
  // TODO: fetch files
  const files = [
    {
      type: "raw_data",
      path: "/records/016_00000000030000000240/data/camera_01_timestamps.csv",
      "content-type": "text/csv",
      start_timestamp: 1489728491,
      end_timestamp: 1489728570.957,
      contents: {
        "camera/front-center": {
          tags: ["camera", "front", "center", "timestamps"],
        },
      },
    },
    {
      type: "raw_data",
      path: "/records/016_00000000030000000240/data/test.csv",
      "content-type": "text/csv",
      start_timestamp: 1489728491,
      end_timestamp: 1489728570.957,
      contents: {
        "camera/front-center": {
          tags: ["camera", "front", "center", "timestamps"],
        },
      },
    },
  ];

  // ! this is dummy func
  // TODO: implement method
  const fileListProps: Props["fileListProps"] = {
    files: files,
    onPreview: (file) => window.alert(`preview: ${JSON.stringify(file)}`),
    onEdit: (file) => window.alert(`edit: ${JSON.stringify(file)}`),
    onDelete: (file) => window.alert(`delete: ${JSON.stringify(file)}`),
    onDownload: (file) => window.alert(`download: ${JSON.stringify(file)}`),
  };
  const onAddFile: Props["onAddFile"] = () =>
    window.alert(`add file:${JSON.stringify(record)}`);
  const onEditRecord: Props["onEditRecord"] = () =>
    window.alert(`edit record:${JSON.stringify(record)}`);
  const recordInfoProps: Props["recordInfoProps"] = {
    record: record,
  };

  return (
    <Component
      classes={classes}
      title={record.record_id}
      onAddFile={onAddFile}
      onEditRecord={onEditRecord}
      tabProps={{ value: tab, onChange: onChangeTab, tabNames: tabNames }}
      recordInfoProps={recordInfoProps}
      fileListProps={fileListProps}
      {...delegated}
    />
  );
};

export { Container as RecordDetailModal };
export type { ContainerProps as RecordDetailModalProps };
