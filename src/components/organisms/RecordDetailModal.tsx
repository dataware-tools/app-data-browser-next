import {
  TabBar,
  TabBarProps,
  metaStore,
  ToolBar,
  Spacer,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import { FileList, FileListProps } from "./FileList";

type Props = {
  classes: ReturnType<typeof useStyles>;
  tabProps: TabBarProps;
  record: metaStore.RecordModel;
  files: metaStore.FileModel[];
  fileListProps: {
    onPreview: FileListProps["onPreview"];
    onDelete: FileListProps["onDelete"];
    onEdit: FileListProps["onEdit"];
    onDownload: FileListProps["onDownload"];
  };
} & ContainerProps;

type ContainerProps = {
  open: boolean;
  onClose: () => void;
};

const Component = ({
  classes,
  open,
  tabProps,
  record,
  onClose,
  files,
  fileListProps,
}: Props): JSX.Element => {
  const tab = tabProps.tabNames[tabProps.value];

  const Main = (): JSX.Element | null =>
    tab === "Info" ? (
      <Table>
        <TableBody>
          {Object.keys(record).map((key) => {
            // TODO: implement
            if (key === "contents") {
              return (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{JSON.stringify(record.contents)}</TableCell>
                </TableRow>
              );
            } else {
              return (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{record[key]}</TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    ) : tab === "Files" ? (
      <FileList files={files} {...fileListProps} />
    ) : null;

  return (
    <Dialog open={open} fullWidth maxWidth="xl" onClose={onClose}>
      <div className={classes.root}>
        <div className={classes.header}>
          <ToolBar>
            <CloseIcon
              className={classes.closeButton}
              onClick={() => {
                onClose();
              }}
              fontSize="large"
            />
          </ToolBar>
        </div>
        <div className={classes.bodyContainer}>
          <div className={classes.tabBarContainer}>
            <TabBar {...tabProps} />
          </div>
          <div className={classes.mainContainer}>
            <Main />
          </div>
        </div>
        <Spacer direction="vertical" size="2vh" />
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },
  header: {
    zIndex: 1,
  },
  closeButton: {
    cursor: "pointer",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  tabBarContainer: {
    flex: 0,
  },
  mainContainer: {
    flex: 1,
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
    onPreview: (file) => window.alert(`preview: ${JSON.stringify(file)}`),
    onEdit: (file) => window.alert(`edit: ${JSON.stringify(file)}`),
    onDelete: (file) => window.alert(`delete: ${JSON.stringify(file)}`),
    onDownload: (file) => window.alert(`download: ${JSON.stringify(file)}`),
  };

  return (
    <Component
      classes={classes}
      tabProps={{ value: tab, onChange: onChangeTab, tabNames: tabNames }}
      record={record}
      files={files}
      fileListProps={fileListProps}
      {...delegated}
    />
  );
};

export { Container as RecordDetailModal };
export type { ContainerProps as RecordDetailModalProps };
