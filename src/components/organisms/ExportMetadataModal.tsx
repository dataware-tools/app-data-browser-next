import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import React, { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "utils/index";
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

type ConfigNameType = "export_metadata";

type ContainerProps = {
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
}: ContainerProps): JSX.Element => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string>("JSON");

  const styles = useStyles();

  const initializeState = () => {
    setIsExporting(false);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onExport = async () => {
    window.alert("export " + databaseId + " as " + exportType);
  };

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer height="auto">
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <TextCenteringSpan>Export metadata</TextCenteringSpan>
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
              pending={isExporting}
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

export { Container as ExportMetadataModal };
export type { ContainerProps as ExportMetadataModalProps, ConfigNameType };
