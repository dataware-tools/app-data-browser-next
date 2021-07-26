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
  ErrorMessageProps,
  confirm,
  alert,
} from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import {
  MetadataInputFieldList,
  MetadataInputFieldListProps,
} from "components/organisms/MetadataInputFieldList";

type Props = {
  nonFilledRequiredFieldNames: MetadataInputFieldListProps["nonFilledRequiredFieldNames"];
  prefixInputElementId: MetadataInputFieldListProps["prefixInputElementId"];
  isSaving: boolean;
  onSave: () => void;
} & Omit<ContainerProps, "onSubmit">;

type ContainerProps = {
  open: boolean;
  create?: boolean;
  currentMetadata: MetadataInputFieldListProps["currentMetadata"];
  fields: MetadataInputFieldListProps["fields"];
  error?: ErrorMessageProps;
  title: string;
  onClose: () => void;
  onSubmit: (newMetadata: Record<string, unknown>) => Promise<boolean>;
};

const Component = ({
  open,
  error,
  create,
  currentMetadata,
  fields,
  nonFilledRequiredFieldNames,
  prefixInputElementId,
  isSaving,
  title,
  onClose,
  onSave,
}: Props) => {
  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>{title}</DialogTitle>
        <DialogContainer padding="0 0 20px" height="65vh">
          {error ? (
            <ErrorMessage {...error} />
          ) : currentMetadata || create ? (
            <>
              <DialogBody>
                <DialogMain>
                  <MetadataInputFieldList
                    currentMetadata={currentMetadata}
                    fields={fields}
                    nonFilledRequiredFieldNames={nonFilledRequiredFieldNames}
                    prefixInputElementId={prefixInputElementId}
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
const Container = ({
  open,
  onClose,
  create,
  fields,
  onSubmit,
  ...delegated
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
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const prefixInputElementId = "MetadataEditModal";
  const onSave = async () => {
    if (fields) {
      setIsSaving(true);
      const newMetadata = {};

      const nonFilledRequired: string[] = [];
      const nonFilledRecommends: string[] = [];

      fields.forEach((config) => {
        const inputEl = document.getElementById(
          `${prefixInputElementId}_${config.name.replace(/\s+/g, "")}`
        ) as HTMLInputElement;
        if (config.necessity === "required" && !inputEl.value) {
          nonFilledRequired.push(config.name);
        }
        if (config.necessity === "recommended" && !inputEl.value) {
          nonFilledRecommends.push(config.name);
        }
      });

      if (nonFilledRequired.length > 0) {
        await alert({
          title: `${JSON.stringify(nonFilledRequired)} is required`,
        });
        setNonFilledRequiredFieldNames(nonFilledRequired);
        setIsSaving(false);
        return;
      } else {
        setNonFilledRequiredFieldNames([]);
      }

      if (nonFilledRecommends.length > 0) {
        if (
          !(await confirm({
            title: `${JSON.stringify(
              nonFilledRecommends
            )} is recommended. Are you sure to save?`,
          }))
        ) {
          setIsSaving(false);
          return;
        }
      }

      fields.forEach((config) => {
        const inputEl = document.getElementById(
          `${prefixInputElementId}_${config.name.replace(/\s+/g, "")}`
        ) as HTMLInputElement;
        newMetadata[config.name] = inputEl.value;
      });

      const isSubmitSucceed = await onSubmit(newMetadata);

      setIsSaving(false);
      if (!isSubmitSucceed) {
        await alert({ title: "save failed. please retry saving" });
        return;
      }
    }
    onClose();
  };

  return (
    <Component
      {...delegated}
      fields={fields}
      isSaving={isSaving}
      nonFilledRequiredFieldNames={nonFilledRequiredFieldNames}
      onClose={onClose}
      onSave={onSave}
      open={open}
      prefixInputElementId={prefixInputElementId}
      create={create}
    />
  );
};

export { Container as MetadataEditModal };
export type { ContainerProps as MetadataEditModalProps };
