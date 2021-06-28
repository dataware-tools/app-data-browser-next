import {
  ErrorMessage,
  LoadingIndicator,
  DialogTitle,
  DialogToolBar,
  DialogBody,
  DialogContainer,
  DialogCloseButton,
  DialogWrapper,
  DialogMain,
  usePrevious,
} from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { compInputFields } from "utils/index";
import {
  MetadataInputFieldList,
  MetadataInputFieldListProps,
} from "components/organisms/MetadataInputFieldList";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  create?: boolean;
  currentMetadata?: MetadataInputFieldListProps["currentMetadata"];
  fields: MetadataInputFieldListProps["fields"];
  error: any;
  onSubmit: (newMetadata: Record<string, unknown>) => Promise<boolean>;
};

const Container = ({
  open,
  onClose,
  create,
  currentMetadata,
  fields: propFields,
  error,
  onSubmit,
}: ContainerProps): JSX.Element => {
  const fields = create
    ? propFields
        .filter(
          (config) => config.necessity && config.necessity !== "unnecessary"
        )
        .sort(compInputFields)
    : propFields.sort(compInputFields);

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
    if (fields) {
      setIsSaving(true);
      const newRecordInfo = {};

      const nonFilledRequired: string[] = [];
      const nonFilledRecommends: string[] = [];

      fields.forEach((config) => {
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

      fields.forEach((config) => {
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
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>{create ? "Add" : "Edit"} Record</DialogTitle>
        <DialogContainer padding="0 0 20px" height="65vh">
          {error ? (
            <ErrorMessage
              reason={JSON.stringify(error)}
              instruction="please reload this page"
            />
          ) : !fields || fields.length <= 0 ? (
            <ErrorMessage
              reason="Input fields is not configured"
              instruction="please report administrator this error"
            />
          ) : currentMetadata || create ? (
            <>
              <DialogBody>
                <DialogMain>
                  <MetadataInputFieldList
                    currentMetadata={currentMetadata}
                    fields={fields}
                    nonFilledRequiredFieldNames={nonFilledRequiredFieldNames}
                  />
                </DialogMain>
                <DialogToolBar
                  right={
                    <LoadingButton pending={isSaving} onClick={onSave}>
                      Save
                    </LoadingButton>
                  }
                />
              </DialogBody>
            </>
          ) : (
            <LoadingIndicator />
          )}
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export { Container as MetadataEditModal };
export type { ContainerProps as MetadataEditModalProps };
