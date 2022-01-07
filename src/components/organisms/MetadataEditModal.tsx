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
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  MetadataInputFieldList,
  MetadataInputFieldListProps,
} from "components/organisms/MetadataInputFieldList";

export type MetadataEditModalPresentationProps = {
  prefixInputElementId: MetadataInputFieldListProps["prefixInputElementId"];
  isSaving: boolean;
  onSave: () => void;
} & Omit<MetadataEditModalProps, "onSubmit"> &
  Pick<MetadataInputFieldListProps, "formControl" | "validateRules">;

type MetadataType = Record<string, string | number>;

export type MetadataEditModalProps = {
  open: boolean;
  create?: boolean;
  currentMetadata?: MetadataType;
  fields: MetadataInputFieldListProps["fields"];
  error?: ErrorMessageProps;
  title: string;
  onClose: () => void;
  onSubmit: (newMetadata: Record<string, unknown>) => Promise<boolean>;
};

type FormInput = MetadataType;

export const MetadataEditModalPresentation = ({
  open,
  error,
  create,
  currentMetadata,
  fields,
  prefixInputElementId,
  isSaving,
  title,
  onClose,
  onSave,
  ...delegated
}: MetadataEditModalPresentationProps): JSX.Element => {
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
                    fields={fields}
                    prefixInputElementId={prefixInputElementId}
                    {...delegated}
                  />
                </DialogMain>
                <DialogToolBar
                  right={
                    <LoadingButton loading={isSaving} onClick={onSave}>
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

export const MetadataEditModal = ({
  open,
  onClose,
  create,
  fields,
  onSubmit,
  currentMetadata,
  ...delegated
}: MetadataEditModalProps): JSX.Element => {
  const [isSaving, setIsSaving] = useState(false);

  const filterCurrenMetadata = useCallback(
    (metadata: MetadataType | undefined) => {
      if (!metadata) {
        return undefined;
      }
      const result = {};
      const filteredKeys = Object.keys(metadata).filter((name) =>
        fields.some((field) => field.name === name)
      );
      filteredKeys.forEach((key) => (result[key] = metadata[key]));
      return result;
    },
    []
  );

  const {
    control,
    formState: { errors: validateErrors },
    handleSubmit,
    reset,
    clearErrors,
    setFocus,
  } = useForm<FormInput>({
    defaultValues: filterCurrenMetadata(currentMetadata),
  });

  const initializeState = () => {
    setIsSaving(false);
    reset(filterCurrenMetadata(currentMetadata));
    clearErrors();
  };

  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const prevCurrentMetadata = usePrevious(currentMetadata);
  useEffect(() => {
    if (currentMetadata && !prevCurrentMetadata) {
      reset(filterCurrenMetadata(currentMetadata));
    }
  }, [reset, currentMetadata, prevCurrentMetadata, filterCurrenMetadata]);

  const validateRules: MetadataEditModalPresentationProps["validateRules"] = {};
  fields.forEach((field) => {
    validateRules[field.name] = {
      required: {
        value: field.necessity === "required",
        message: `${field.display_name} is required`,
      },
      pattern: ["integer", "int", "float", "double", "number"].includes(
        field.dtype
      )
        ? {
            value: /^-?\d{1,}\.?\d*$/,
            message: `${field.display_name} should be number`,
          }
        : undefined,
    };
  });

  const prefixInputElementId = "MetadataEditModal";
  const onSave = handleSubmit(async (values) => {
    if (fields) {
      setIsSaving(true);

      const nonFilledRequired: string[] = [];
      const nonFilledRecommends: string[] = [];

      fields.forEach((field) => {
        const error = validateErrors[field.name];
        if (error?.type === "required") {
          nonFilledRequired.push(field.name);
        }
        if (field.necessity === "recommended" && !values[field.name]) {
          nonFilledRecommends.push(field.name);
        }
      });

      if (nonFilledRequired.length > 0) {
        await alert({
          title: `${JSON.stringify(nonFilledRequired)} is required`,
        });
        setFocus(nonFilledRequired[0]);
        setIsSaving(false);
        return;
      }

      if (nonFilledRecommends.length > 0) {
        if (
          !(await confirm({
            title: `${JSON.stringify(
              nonFilledRecommends
            )} is recommended. Are you sure to save?`,
          }))
        ) {
          setFocus(nonFilledRecommends[0]);
          setIsSaving(false);
          return;
        }
      }

      const isSubmitSucceed = await onSubmit(values);

      setIsSaving(false);
      if (!isSubmitSucceed) {
        await alert({ title: "save failed. please retry saving" });
        return;
      }
    }
    onClose();
  });

  return (
    <MetadataEditModalPresentation
      {...delegated}
      fields={fields}
      isSaving={isSaving}
      onClose={onClose}
      onSave={onSave}
      open={open}
      prefixInputElementId={prefixInputElementId}
      create={create}
      formControl={control}
      currentMetadata={currentMetadata}
      validateRules={validateRules}
    />
  );
};
