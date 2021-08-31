import { useAuth0 } from "@auth0/auth0-react";
import {
  DialogBody,
  DialogContainer,
  DialogToolBar,
  DialogTitle,
  DialogCloseButton,
  DialogWrapper,
  DialogMain,
  NoticeableLetters,
  usePrevious,
  ErrorMessageProps,
  ErrorMessage,
  alert,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useState, useEffect } from "react";

// See: https://github.com/dolezel/react-csv-downloader#get-csv-contents
import downloadCSV from "react-csv-downloader/dist/cjs/lib/csv";
import { useListRecords } from "utils/index";

export type ConfigNameType = "export_metadata";

export type ExportMetadataModalPresentationProps = {
  exportType: string;
  onExport: () => Promise<void>;
  onChangeExportType: (newExportType: string) => void;
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
} & ExportMetadataModalProps;

export type ExportMetadataModalProps = {
  open: boolean;
  onClose: () => void;
  databaseId: string;
};

export const ExportMetadataModalPresentation = ({
  open,
  error,
  onClose,
  databaseId,
  exportType,
  onExport,
  onChangeExportType,
  isFetchComplete,
}: ExportMetadataModalPresentationProps): JSX.Element => {
  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <NoticeableLetters>{`Export metadata in ${databaseId}`}</NoticeableLetters>
        </DialogTitle>
        <DialogContainer height="auto">
          <DialogBody>
            {error ? (
              <ErrorMessage {...error} />
            ) : (
              <DialogMain>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexShrink: 0,
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <FormControl>
                    <InputLabel id="export-type-label">Format: </InputLabel>
                    <Select
                      labelId="export-type-label"
                      value={exportType}
                      onChange={(event) => {
                        onChangeExportType(event.target.value);
                      }}
                    >
                      <MenuItem value="JSON">JSON</MenuItem>
                      <MenuItem value="CSV">CSV</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </DialogMain>
            )}
          </DialogBody>
        </DialogContainer>
        <DialogToolBar
          right={
            <LoadingButton onClick={onExport} loading={!isFetchComplete}>
              Export
            </LoadingButton>
          }
        />
      </DialogWrapper>
    </Dialog>
  );
};

export const ExportMetadataModal = ({
  databaseId,
  open,
  ...delegated
}: ExportMetadataModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [exportType, setExportType] = useState<string>("JSON");
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

  const initializeState = () => {
    setExportType("JSON");
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const { data: listRecordsRes, error: listRecordsError } = useListRecords(
    getAccessToken,
    {
      databaseId,
      perPage: 999999999, // FIXME
    }
  );

  const fetchError = listRecordsError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } = extractErrorMessageFromFetchError(
        fetchError
      );
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  const exportAsJSON = () => {
    if (listRecordsRes) {
      const fileName = `metadata-${databaseId}.json`;
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
      const flatData = listRecordsRes.data.map((item) => {
        const metadata = {};
        for (const [key, value] of Object.entries(item)) {
          metadata[key] = `"${JSON.stringify(value)}"`;
        }
        return metadata;
      });

      // TODO: Support mapping column names to display-names
      downloadCSV({
        datas: flatData,
      }).then((csv) => {
        const fileName = `metadata-${databaseId}.csv`;
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
    switch (exportType) {
      case "JSON":
        exportAsJSON();
        break;
      case "CSV":
        exportAsCSV();
        break;
      default:
        await alert({ title: "Unsupported format" });
    }
  };

  const onExport = async () => {
    exportMetadata(exportType);
  };

  const isFetchComplete = Boolean(!fetchError && listRecordsRes);

  return (
    <ExportMetadataModalPresentation
      isFetchComplete={isFetchComplete}
      exportType={exportType}
      databaseId={databaseId}
      onChangeExportType={setExportType}
      onExport={onExport}
      open={open}
      error={error}
      {...delegated}
    />
  );
};
