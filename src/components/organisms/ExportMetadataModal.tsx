import { useAuth0 } from "@auth0/auth0-react";
import { RecordModel } from "@dataware-tools/api-meta-store-client/dist/browser/client";
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
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";

// See: https://github.com/dolezel/react-csv-downloader#get-csv-contents
import downloadCSV from "react-csv-downloader/dist/cjs/lib/csv";
import { useGetConfig, useListRecords } from "utils/index";

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
              <DialogMain
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexShrink: 0,
                  justifyContent: "center",
                }}
              >
                <FormControl sx={{ margin: 1 }}>
                  <InputLabel id="export-type-label">Format: </InputLabel>
                  <Select
                    label="Format:"
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

  const { data: databaseConfig, error: databaseConfigError } = useGetConfig(
    getAccessToken,
    {
      databaseId,
    }
  );

  const { data: listRecordsRes, error: listRecordsError } = useListRecords(
    getAccessToken,
    {
      databaseId,
      perPage: 999999999, // FIXME
    }
  );

  const fetchError = listRecordsError || databaseConfigError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } =
        extractErrorMessageFromFetchError(fetchError);
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  const preprocessData = (data: RecordModel[]): RecordModel[] => {
    // This function applies the following pre-processes:
    // - Map each column-name to display-name
    // - Remove empty file paths

    const mapper = {};
    if (databaseConfig) {
      for (const column of databaseConfig.columns) {
        mapper[column.name] = column.display_name;
      }
    }

    return data.map((item) => {
      const newData = {};
      for (const [key, value] of Object.entries(item)) {
        let newValue = value;

        if (key === "path") {
          if (value instanceof Array) {
            newValue = value.filter((element) => {
              return !["", "/", "./.", "./", "/.", "."].includes(element);
            });
          }
        }

        if (Object.keys(mapper).includes(key)) {
          newData[mapper[key]] = newValue;
        } else {
          newData[key] = newValue;
        }
      }
      return newData;
    });
  };

  const exportAsJSON = () => {
    if (listRecordsRes) {
      const fileName = `metadata-${databaseId}.json`;
      const data = new Blob(
        [JSON.stringify(preprocessData(listRecordsRes.data))],
        {
          type: "text/json",
        }
      );
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
      const flatData = preprocessData(listRecordsRes.data).map((item) => {
        const metadata = {};
        for (const [key, value] of Object.entries(item)) {
          if (value instanceof Object || value instanceof Array) {
            metadata[key] = `${JSON.stringify(value)}`;
          } else {
            metadata[key] = value;
          }
        }
        return metadata;
      });

      downloadCSV({
        datas: flatData,
        wrapColumnChar: '"',
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
