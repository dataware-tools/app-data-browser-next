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
import Box from "@material-ui/core/Box";
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
import { useRecoilValue } from "recoil";
import { databasePaginateState } from "globalStates";
import {
  extractReasonFromFetchError,
  initializeDatabaseConfig,
  useListDatabases,
} from "utils";

type Props = {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  error?: ErrorMessageProps;
  formErrors: DeepMap<FormInput, FieldError>;
  control: Control<FormInput>;
} & Omit<ContainerProps, "onSubmitSucceeded">;

type ContainerProps = {
  onClose: () => void;
  onSubmitSucceeded?: (newDatabase: metaStore.DatabaseModel) => void;
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
                  <Box mt={1}>
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
                  </Box>
                  <Box mt={3}>
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
                  </Box>
                  <Box mt={3}>
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
                  </Box>
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
  const { page, perPage, search } = useRecoilValue(databasePaginateState);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: listDatabasesRes,
    mutate: listDatabasesMutate,
  } = useListDatabases(getAccessToken, { page, perPage, search });

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

    const procAfterFail = async (error: any) => {
      await fetchMetaStore(
        getAccessToken,
        metaStore.DatabaseService.deleteDatabase,
        {
          databaseId: requestBody.database_id,
        }
      );
      setError({
        reason: extractReasonFromFetchError(error),
        instruction: "Please reload this page",
      });
    };

    const [createDatabaseRes, createDatabaseError] = await fetchMetaStore(
      getAccessToken,
      metaStore.DatabaseService.createDatabase,
      {
        requestBody,
      }
    );
    if (createDatabaseError) {
      await procAfterFail(createDatabaseError);
      return;
    }

    const createdDatabaseId =
      createDatabaseRes?.database_id || requestBody.database_id;
    const [getConfigRes, getConfigError] = await fetchMetaStore(
      getAccessToken,
      metaStore.ConfigService.getConfig,
      { databaseId: createdDatabaseId }
    );
    if (getConfigError) {
      await procAfterFail(getConfigError);
      return;
    }

    const { error: initializeDatabaseError } = await initializeDatabaseConfig(
      getAccessToken,
      createdDatabaseId,
      getConfigRes || {}
    );
    if (initializeDatabaseError) {
      await procAfterFail(initializeDatabaseError);
      return;
    }

    if (createDatabaseRes) {
      if (listDatabasesRes) {
        listDatabasesMutate({
          ...listDatabasesRes,
          data: [createDatabaseRes, ...listDatabasesRes.data],
        });
        onSubmitSucceeded && onSubmitSucceeded(createDatabaseRes);
      } else {
        listDatabasesMutate();
      }
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
