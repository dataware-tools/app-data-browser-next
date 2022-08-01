import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  DialogBody,
  DialogCloseButton,
  DialogContainer,
  DialogMain,
  DialogTitle,
  DialogToolBar,
  DialogWrapper,
  usePrevious,
  confirm,
  useConfirmClosingWindow,
} from "@dataware-tools/app-common";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import equal from "fast-deep-equal";
import { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  Control,
  FieldErrors,
} from "react-hook-form";
import { useRecoilValue } from "recoil";
import { databasePaginateState } from "globalStates";
import {
  fetchMetaStore,
  initializeDatabaseConfig,
  useGetDatabase,
  useListDatabases,
  enqueueErrorToastForFetchError,
} from "utils";

export type DatabaseEditModalPresentationProps<T extends boolean> = {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  formErrors: FieldErrors<FormInput>;
  control: Control<FormInput>;
  onClose: (reason?: string) => void;
} & Omit<
  DatabaseEditModalProps<T>,
  "onSubmitSucceeded" | "databaseId" | "currentData" | "onClose"
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
  onSubmit,
  isSubmitting,
  formErrors,
  control,
  add,
  ...delegated
}: DatabaseEditModalPresentationProps<T>): JSX.Element => {
  return (
    <Dialog {...delegated} onClose={(_, reason) => onClose(reason)}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>{`${add ? "Add" : "Update"} database`}</DialogTitle>
        <DialogContainer padding="0 0 20px">
          <DialogBody>
            <DialogMain>
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
  onClose: propsOnClose,
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
    getValues,
    reset,
  } = useForm<FormInput>({ defaultValues: currentData });
  const { page, perPage, search } = useRecoilValue(databasePaginateState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: listDatabasesRes, mutate: listDatabasesMutate } =
    useListDatabases(getAccessToken, { page, perPage, search });
  const { mutate: getDatabaseMutate } = useGetDatabase(getAccessToken, {
    databaseId,
  });

  const {
    addEventListener: addEventListenerForConfirmClosingWindow,
    removeEventListener: removeEventListenerForConfirmClosingWindow,
  } = useConfirmClosingWindow(() => {
    if (
      add &&
      Object.values(getValues()).some((value) => value !== "" && value != null)
    ) {
      return true;
    } else if (!add && currentData && !equal(currentData, getValues())) {
      return true;
    }

    return false;
  });

  const initializeState = () => {
    setIsSubmitting(false);
    reset(currentData);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
      addEventListenerForConfirmClosingWindow();
    }
  }, [open, prevOpen]);

  const onSubmit: SubmitHandler<FormInput> = async (requestBody) => {
    setIsSubmitting(true);

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
      enqueueErrorToastForFetchError(
        add
          ? "Failed to create new database"
          : "Failed to update database info",
        saveDatabaseError
      );
      setIsSubmitting(false);
      return;
    }

    if (add) {
      const createdDatabaseId =
        saveDatabaseRes?.database_id || requestBody.database_id;
      const [getConfigRes, getConfigError] = await fetchMetaStore(
        getAccessToken,
        metaStore.ConfigService.getConfig,
        { databaseId: createdDatabaseId }
      );
      if (getConfigError) {
        enqueueErrorToastForFetchError("Failed to get config", getConfigError);
        setIsSubmitting(false);
        return;
      }

      const { error: initializeDatabaseError } = await initializeDatabaseConfig(
        getAccessToken,
        createdDatabaseId,
        getConfigRes || {}
      );
      if (initializeDatabaseError) {
        enqueueErrorToastForFetchError(
          "Failed to initialize config for database",
          initializeDatabaseError
        );
        setIsSubmitting(false);
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
    propsOnClose();
  };

  const onClose = async (reason?: string) => {
    const confirmClosingModal = async () => {
      return await confirm({
        title: "Are you sure you want close this dialog?",
        body: "Changed data will not be saved",
        confirmText: "Close",
        confirmMode: "delete",
      });
    };

    switch (reason) {
      case "backdropClick":
      case "escapeKeyDown":
        if (
          add &&
          Object.values(getValues()).some(
            (value) => value !== "" && value != null
          )
        ) {
          if (!(await confirmClosingModal())) {
            return;
          }
        } else if (!add && currentData && !equal(currentData, getValues())) {
          if (!(await confirmClosingModal())) {
            return;
          }
        }

        removeEventListenerForConfirmClosingWindow();
        propsOnClose();
        break;

      default:
        removeEventListenerForConfirmClosingWindow();
        propsOnClose();
    }
  };
  return (
    <DatabaseEditModalPresentation
      add={add}
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      formErrors={formErrors}
      control={control}
      {...delegated}
    />
  );
};
