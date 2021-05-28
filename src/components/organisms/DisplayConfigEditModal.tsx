import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "../../utils/index";
import { DisplayConfigList } from "components/organisms/DisplayConfigList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { SquareIconButton } from "components/atoms/SquareIconButton";
import { DialogTitle } from "components/atoms/DialogTitle";
import { TextCenteringSpan } from "components/atoms/TextCenteringSpan";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogContainer } from "components/atoms/DialogContainer";
import { DialogToolBar } from "components/atoms/DialogToolBar";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  configName: "recordDisplayConfig";
};

// TODO: fetch from server
const getDatabaseConfigRes = {
  recordInputConfig: [
    { name: "record name", necessity: "required" },
    { name: "required", necessity: "required" },
    { name: "recommended", necessity: "recommended" },
    { name: "description", necessity: "optional" },
    { name: "optional", necessity: "optional" },
  ],
  fileInputConfig: [{ name: "description", necessity: "required" }],
  recordDisplayConfig: ["record name", "description"],
};

const title = { recordDisplayConfig: "Record Display Fields" };

const Container = ({
  open,
  onClose,
  configName,
}: ContainerProps): JSX.Element => {
  const [isSaving, setIsSaving] = useState(false);
  // TODO: initialize state after success fetching
  const [config, setConfig] = useState(
    configName in getDatabaseConfigRes ? getDatabaseConfigRes[configName] : null
  );

  const initializeState = () => {
    setIsSaving(false);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onSave = async () => {
    setIsSaving(true);
    // TODO: implement onSave
    setIsSaving(false);
    onClose();
  };

  const onAdd = () =>
    setConfig((prev) => {
      return prev ? [...prev, ""] : [""];
    });

  const options =
    getDatabaseConfigRes.recordInputConfig?.map((config) => config.name) || [];

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <TextCenteringSpan>{title[configName] + " "}</TextCenteringSpan>
          <SquareIconButton onClick={onAdd} icon={<AddCircleIcon />} />
        </DialogTitle>
        <DialogBody>
          <DisplayConfigList
            value={config || []}
            onChange={(newValue) => setConfig(newValue)}
            options={options}
          />
        </DialogBody>
        <DialogToolBar
          right={
            <LoadingButton pending={isSaving} onClick={onSave}>
              Save
            </LoadingButton>
          }
        />
      </DialogContainer>
    </Dialog>
  );
};

export { Container as DisplayConfigEditModal };
export type { ContainerProps as DisplayConfigEditModalProps };
