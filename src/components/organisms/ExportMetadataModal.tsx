import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "utils/index";
import { DialogTitle } from "components/atoms/DialogTitle";
import { TextCenteringSpan } from "components/atoms/TextCenteringSpan";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogContainer } from "components/atoms/DialogContainer";
import { DialogToolBar } from "components/atoms/DialogToolBar";

type ConfigNameType = "export_metadata";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  databaseId: string;
  configName: ConfigNameType;
};

const title = { export_metadata: "Export metadata" };

const Container = ({
  open,
  onClose,
  databaseId,
  configName,
}: ContainerProps): JSX.Element => {
  const [isExporting, setIsExporting] = useState(false);

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
    window.alert("export");
  };

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <TextCenteringSpan>{title[configName] + " "}</TextCenteringSpan>
        </DialogTitle>
        <DialogBody>{databaseId}</DialogBody>
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
