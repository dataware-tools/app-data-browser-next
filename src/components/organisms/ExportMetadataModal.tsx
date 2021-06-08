import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import React, { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useListRecords, usePrevious } from "utils/index";
import { DialogTitle } from "components/atoms/DialogTitle";
import { TextCenteringSpan } from "components/atoms/TextCenteringSpan";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogContainer } from "components/atoms/DialogContainer";
import { DialogToolBar } from "components/atoms/DialogToolBar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { FormControl, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Spacer } from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import downloadCSV from "react-csv-downloader/dist/cjs/lib/csv";

type ConfigNameType = "export_metadata";

type ContainerProps = ContainerWithRequestsProps & {
  isLoading: boolean;
  exportMetadata: (exportType: string) => void;
};

type ContainerWithRequestsProps = {
  open: boolean;
  onClose: () => void;
  databaseId: string;
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

const Container = ({
  open,
  onClose,
  databaseId,
  isLoading,
  exportMetadata,
}: ContainerProps): JSX.Element => {
  const [exportType, setExportType] = useState<string>("JSON");

  const styles = useStyles();

  const initializeState = () => {
    setExportType("JSON");
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onExport = async () => {
    exportMetadata(exportType);
  };

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer height="auto">
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <TextCenteringSpan>
            {"Export metadata in " + databaseId}
          </TextCenteringSpan>
        </DialogTitle>
        <DialogBody>
          <div className={styles.body}>
            <FormControl>
              <InputLabel id="export-type-label">Format: </InputLabel>
              <Select
                labelId="export-type-label"
                value={exportType}
                onChange={(event) => {
                  setExportType(() => {
                    return event.target.value;
                  });
                }}
              >
                <MenuItem value="JSON">JSON</MenuItem>
                <MenuItem value="CSV">CSV</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogBody>
        <Spacer direction="vertical" size="2vh" />
        <DialogToolBar
          right={
            <LoadingButton
              disabled={false}
              pending={isLoading}
              onClick={onExport}
            >
              Export
            </LoadingButton>
          }
        />
      </DialogContainer>
    </Dialog>
  );
};

const ContainerWithRequests = ({
  databaseId,
  ...props
}: ContainerWithRequestsProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently: getAccessToken } = useAuth0();

  const listRecords = useListRecords(getAccessToken, {
    databaseId,
    perPage: 999999999, // FIXME
  });
  const listRecordsRes = listRecords[0];

  useEffect(() => {
    if (listRecordsRes) {
      setIsLoading(() => {
        return false;
      });
    } else {
      setIsLoading(() => {
        return true;
      });
    }
  }, [listRecordsRes]);

  const exportAsJSON = () => {
    if (listRecordsRes) {
      const fileName = "metadata-" + databaseId + ".json";
      const data = new Blob([JSON.stringify(listRecordsRes.data)], {
        type: "text/json",
      });
      const jsonURL = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = jsonURL;
      link.setAttribute("download", fileName);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportAsCSV = () => {
    if (listRecordsRes) {
      // TODO: Support mapping column names to display-names
      downloadCSV({
        datas: listRecordsRes.data,
      }).then((csv) => {
        const fileName = "metadata-" + databaseId + ".csv";
        const data = new Blob([String(csv)], {
          type: "text/csv",
        });
        const jsonURL = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = jsonURL;
        link.setAttribute("download", fileName);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const exportMetadata = async (exportType: string) => {
    if (isLoading) {
      window.alert("Not ready");
    } else {
      switch (exportType) {
        case "JSON":
          exportAsJSON();
          break;
        case "CSV":
          exportAsCSV();
          break;
        default:
          window.alert("Unsupported format");
      }
    }
  };

  return (
    <Container
      isLoading={isLoading}
      exportMetadata={exportMetadata}
      databaseId={databaseId}
      {...props}
    />
  );
};

export { ContainerWithRequests as ExportMetadataModal };
export type { ContainerProps as ExportMetadataModalProps, ConfigNameType };
