import {
  DialogBody,
  DialogCloseButton,
  DialogContainer,
  DialogMain,
  DialogTitle,
  DialogToolBar,
  DialogWrapper,
  metaStore,
  fetchMetaStore,
  ErrorMessageProps,
  ErrorMessage,
  usePrevious,
} from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  Control,
  DeepMap,
  FieldError,
} from "react-hook-form";
import LoadingButton from "@material-ui/lab/LoadingButton";

type Props = {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  error?: ErrorMessageProps;
  formErrors: DeepMap<FormInput, FieldError>;
  control: Control<FormInput>;
} & Omit<ContainerProps, "onSubmitSucceeded">;

type ContainerProps = {
  onClose: () => void;
  onSubmitSucceeded: (newDatabase: metaStore.DatabaseModel) => void;
} & Omit<DialogProps, "onClose" | "onSubmit">;

type FormInput = {
  database_id: string;
  name?: string;
  description?: string;
};

const Component = ({
  onClose,
  error,
  onSubmit,
  isSubmitting,
  formErrors,
  control,
  ...delegated
}: Props) => {
  return (
    <Dialog {...delegated}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>Add database</DialogTitle>
        <DialogContainer padding="0 0 20px">
          <DialogBody>
            <DialogMain>
              {error ? (
                <ErrorMessage {...error} />
              ) : (
                <>
                  <label htmlFor="DatabaseAddModal_database_id">
                    Database ID
                  </label>
                  <Controller
                    name="database_id"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={formErrors.database_id?.type === "required"}
                        helperText={
                          formErrors.database_id?.type === "required" &&
                          "Database ID is required"
                        }
                        fullWidth
                        id="DatabaseAddModal_database_id"
                      />
                    )}
                  />
                  <label htmlFor="DatabaseAddModal_name">Name</label>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="DatabaseAddModal_name"
                        error={formErrors.name?.type === "required"}
                        helperText={
                          formErrors.name?.type === "required" &&
                          "Name is required"
                        }
                      />
                    )}
                  />
                  <label htmlFor="DatabaseAddModal_description">
                    Description
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id="DatabaseAddModal_description"
                      />
                    )}
                  />
                </>
              )}
            </DialogMain>
          </DialogBody>
        </DialogContainer>
        <DialogToolBar
          right={
            <LoadingButton pending={isSubmitting} onClick={onSubmit}>
              Save
            </LoadingButton>
          }
        />
      </DialogWrapper>
    </Dialog>
  );
};

const Container = ({
  onSubmitSucceeded,
  open,
  onClose,
  ...delegated
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const {
    control,
    formState: { errors: formErrors },
    handleSubmit,
  } = useForm<FormInput>();

  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initializeState = () => {
    setError(undefined);
    setIsSubmitting(false);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onSubmit: SubmitHandler<FormInput> = async (requestBody) => {
    setIsSubmitting(true);

    const [createDatabaseRes, createDatabaseError] = await fetchMetaStore(
      getAccessToken,
      metaStore.DatabaseService.createDatabase,
      {
        requestBody,
      }
    );
    if (createDatabaseError) {
      setError({
        reason: JSON.stringify(createDatabaseError),
        instruction: "Please reload this page",
      });
      return;
    } else if (createDatabaseRes) {
      onSubmitSucceeded(createDatabaseRes);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Component
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      error={error}
      formErrors={formErrors}
      control={control}
      {...delegated}
    />
  );
};

export { Container as DatabaseAddModal };
export type { ContainerProps as DatabaseAddModalProps };
