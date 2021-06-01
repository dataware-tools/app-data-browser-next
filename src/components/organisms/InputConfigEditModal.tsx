import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "utils/index";
import { InputConfigList } from "components/organisms/InputConfigList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { SquareIconButton } from "components/atoms/SquareIconButton";
import { DialogTitle } from "components/atoms/DialogTitle";
import { TextCenteringSpan } from "components/atoms/TextCenteringSpan";
import { DialogContainer } from "components/atoms/DialogContainer";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogToolBar } from "components/atoms/DialogToolBar";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  configName: "recordInputConfig";
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
  recordDisplayConfig: ["name", "description"],
};

const title = { recordInputConfig: "Record Input Fields" };

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
      return prev
        ? [...prev, { name: "", necessity: "recommended" }]
        : [{ name: "", necessity: "recommended" }];
    });

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <TextCenteringSpan>{title[configName] + " "}</TextCenteringSpan>
          <SquareIconButton onClick={onAdd} icon={<AddCircleIcon />} />
        </DialogTitle>
        <DialogBody>
          <InputConfigList
            value={config || [{ name: "Record name", necessity: "required" }]}
            onChange={(newValue) => setConfig(newValue)}
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

export { Container as InputConfigEditModal };
export type { ContainerProps as InputConfigEditModalProps };
