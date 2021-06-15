import {
  ErrorMessage,
  LoadingIndicator,
  DialogTitle,
  DialogToolBar,
  DialogBody,
  DialogContainer,
  DialogCloseButton,
} from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "utils/index";
import {
  MetadataInputFieldList,
  MetadataInputFieldListProps,
} from "components/organisms/MetadataInputFieldList";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  create?: boolean;
  currentMetadata?: MetadataInputFieldListProps["currentMetadata"];
  inputConfig: MetadataInputFieldListProps["inputConfig"] | null;
  error: any;
  onSubmit: (newMetadata: Record<string, unknown>) => Promise<boolean>;
};

const Container = ({
  open,
  onClose,
  create,
  currentMetadata,
  inputConfig,
  error,
  onSubmit,
}: ContainerProps): JSX.Element => {
  const [isSaving, setIsSaving] = useState(false);
  const [
    nonFilledRequiredFieldNames,
    setNonFilledRequiredFieldNames,
  ] = useState<string[]>([]);

  const initializeState = () => {
    setIsSaving(false);
    setNonFilledRequiredFieldNames([]);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onSave = async () => {
    if (inputConfig) {
      setIsSaving(true);
      const newRecordInfo = {};

      const nonFilledRequired: string[] = [];
      const nonFilledRecommends: string[] = [];

      inputConfig.forEach((config) => {
        const inputEl = document.getElementById(
          `RecordEditModalInputFields_${config.name.replace(/\s+/g, "")}`
        ) as HTMLInputElement;
        if (config.necessity === "required" && !inputEl.value) {
          nonFilledRequired.push(config.name);
        }
        if (config.necessity === "recommended" && !inputEl.value) {
          nonFilledRecommends.push(config.name);
        }
      });

      if (nonFilledRequired.length > 0) {
        window.alert(`${JSON.stringify(nonFilledRequired)} is required`);
        setNonFilledRequiredFieldNames(nonFilledRequired);
        setIsSaving(false);
        return;
      } else {
        setNonFilledRequiredFieldNames([]);
      }

      if (nonFilledRecommends.length > 0) {
        if (
          !window.confirm(
            `${JSON.stringify(
              nonFilledRecommends
            )} is recommended. Are you sure to save?`
          )
        ) {
          setIsSaving(false);
          return;
        }
      }

      // ! do not to depend on id!
      inputConfig.forEach((config) => {
        const inputEl = document.getElementById(
          `RecordEditModalInputFields_${config.name.replace(/\s+/g, "")}`
        ) as HTMLInputElement;
        newRecordInfo[config.name] = inputEl.value;
      });

      const isSubmitSucceed = await onSubmit(newRecordInfo);

      if (!isSubmitSucceed) {
        setIsSaving(false);
        window.alert("save failed. please retry saving");
        return;
      }

      setIsSaving(false);
    }
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>{create ? "Add" : "Edit"} Record</DialogTitle>
        {error ? (
          <ErrorMessage
            reason={JSON.stringify(error)}
            instruction="please reload this page"
          />
        ) : !inputConfig || inputConfig.length <= 0 ? (
          <ErrorMessage
            reason="Input fields is not configured"
            instruction="please report administrator this error"
          />
        ) : currentMetadata || create ? (
          <>
            <DialogBody>
              <MetadataInputFieldList
                currentMetadata={currentMetadata}
                inputConfig={inputConfig}
                nonFilledRequiredFieldNames={nonFilledRequiredFieldNames}
              />
            </DialogBody>
            <DialogToolBar
              right={
                <LoadingButton pending={isSaving} onClick={onSave}>
                  Save
                </LoadingButton>
              }
            />
          </>
        ) : (
          <LoadingIndicator />
        )}
      </DialogContainer>
    </Dialog>
  );
};

export { Container as MetadataEditModal };
export type { ContainerProps as MetadataEditModalProps };
