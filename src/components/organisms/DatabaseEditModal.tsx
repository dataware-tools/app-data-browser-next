import { useAuth0 } from "@auth0/auth0-react";
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
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import Box from "@material-ui/core/Box";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  Control,
  DeepMap,
  FieldError,
} from "react-hook-form";
import { useRecoilValue } from "recoil";
import { databasePaginateState } from "globalStates";
import {
  initializeDatabaseConfig,
  useGetDatabase,
  useListDatabases,
} from "utils";

export type DatabaseEditModalPresentationProps<T extends boolean> = {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  error?: ErrorMessageProps;
  formErrors: DeepMap<FormInput, FieldError>;
  control: Control<FormInput>;
} & Omit<
  DatabaseEditModalProps<T>,
  "onSubmitSucceeded" | "databaseId" | "currentData"
>;

export type DatabaseEditModalProps<T extends boolean> = {
  onClose: () => void;
  onSubmitSucceeded?: (newDatabase: metaStore.DatabaseModel) => void;
  databaseId?: T extends true ? never : string;
  currentData?: T extends true ? never : metaStore.DatabaseModel;
  add?: T;
} & Omit<DialogProps, "onClose" | "onSubmit">;

type FormInput = {
  database_id: string;
  name?: string;
  description?: string;
};

export const DatabaseEditModalPresentation = <T extends boolean>({
  onClose,
  error,
  onSubmit,
  isSubmitting,
  formErrors,
  control,
  add,
  ...delegated
}: DatabaseEditModalPresentationProps<T>): JSX.Element => {
  return (
    <Dialog {...delegated} onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>{`${add ? "Add" : "Update"} database`}</DialogTitle>
        <DialogContainer padding="0 0 20px">
          <DialogBody>
            <DialogMain>
              {error ? (
                <ErrorMessage {...error} />
              ) : (
                <>
                  {add ? (
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
                  ) : null}
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
            <LoadingButton loading={isSubmitting} onClick={onSubmit}>
              Save
            </LoadingButton>
          }
        />
      </DialogWrapper>
    </Dialog>
  );
};

export const DatabaseEditModal = <T extends boolean>({
  onSubmitSucceeded,
  open,
  onClose,
  databaseId,
  add,
  currentData,
  ...delegated
}: DatabaseEditModalProps<T>): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const {
    control,
    formState: { errors: formErrors },
    handleSubmit,
  } = useForm<FormInput>({ defaultValues: currentData });
  const { page, perPage, search } = useRecoilValue(databasePaginateState);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: listDatabasesRes,
    mutate: listDatabasesMutate,
  } = useListDatabases(getAccessToken, { page, perPage, search });
  const { mutate: getDatabaseMutate } = useGetDatabase(getAccessToken, {
    databaseId,
  });

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

    const procAfterFailAdd = async (error: any) => {
      await fetchMetaStore(
        getAccessToken,
        metaStore.DatabaseService.deleteDatabase,
        {
          databaseId: requestBody.database_id,
        }
      );
      const { reason, instruction } = extractErrorMessageFromFetchError(error);
      setError({ reason, instruction });
    };

    const [saveDatabaseRes, saveDatabaseError] =
      !add && databaseId
        ? await fetchMetaStore(
            getAccessToken,
            metaStore.DatabaseService.updateDatabase,
            { databaseId, requestBody }
          )
        : await fetchMetaStore(
            getAccessToken,
            metaStore.DatabaseService.createDatabase,
            {
              requestBody,
            }
          );

    if (saveDatabaseError) {
      if (add) {
        procAfterFailAdd(saveDatabaseError);
      } else {
        const { reason, instruction } = extractErrorMessageFromFetchError(
          saveDatabaseError
        );
        setError({ reason, instruction: instruction });
      }
      return;
    }

    if (add) {
      const createdDatabaseId =
        saveDatabaseRes?.database_id || requestBody.database_id;
      const [
        getConfigRes,
        getConfigError,
      ] = await fetchMetaStore(
        getAccessToken,
        metaStore.ConfigService.getConfig,
        { databaseId: createdDatabaseId }
      );
      if (getConfigError) {
        await procAfterFailAdd(getConfigError);
        return;
      }

      const { error: initializeDatabaseError } = await initializeDatabaseConfig(
        getAccessToken,
        createdDatabaseId,
        getConfigRes || {}
      );
      if (initializeDatabaseError) {
        await procAfterFailAdd(initializeDatabaseError);
        return;
      }
    }

    if (saveDatabaseRes) {
      if (listDatabasesRes) {
        listDatabasesMutate({
          ...listDatabasesRes,
          data: [saveDatabaseRes, ...listDatabasesRes.data],
        });
        onSubmitSucceeded && onSubmitSucceeded(saveDatabaseRes);
      } else {
        listDatabasesMutate();
      }
    }

    getDatabaseMutate(saveDatabaseRes);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <DatabaseEditModalPresentation
      add={add}
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      error={error}
      // @ts-expect-error for committing temporarily
      formErrors={formErrors}
      control={control}
      {...delegated}
    />
  );
};
