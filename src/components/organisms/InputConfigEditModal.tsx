import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogCloseButton,
  DialogToolBar,
  DialogBody,
  DialogTitle,
  DialogContainer,
  DialogWrapper,
  DialogMain,
  usePrevious,
  NoticeableLetters,
  LoadingIndicator,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { produce } from "immer";
import { useState, useEffect } from "react";
import {
  InputConfigList,
  InputConfigListProps,
} from "components/organisms/InputConfigList";
import { useGetConfig, fetchMetaStore, isEditableColumnName } from "utils";

export type ConfigNameType = "record_add_editable_columns";

export type InputConfigEditPresentationProps = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  inputColumns: InputConfigListProps["value"];
  nonInputColumns: InputConfigListProps["restColumns"];
  onChangeInputColumns: InputConfigListProps["onChange"];
  isSaving: boolean;
  onSave: () => void;
} & Omit<InputConfigEditModalProps, "databaseId">;

export type InputConfigEditModalProps = {
  open: boolean;
  onClose: () => void;
  databaseId: string;
};

export const InputConfigEditPresentation = ({
  open,
  onClose,
  error,
  isFetchComplete,
  inputColumns,
  nonInputColumns,
  onChangeInputColumns,
  isSaving,
  onSave,
}: InputConfigEditPresentationProps): JSX.Element => {
  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <NoticeableLetters>Input columns</NoticeableLetters>
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          {error ? (
            <ErrorMessage {...error} />
          ) : isFetchComplete ? (
            <DialogBody>
              <DialogMain>
                <InputConfigList
                  value={inputColumns}
                  onChange={onChangeInputColumns}
                  restColumns={nonInputColumns}
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
          ) : (
            <LoadingIndicator />
          )}
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export const InputConfigEditModal = ({
  open,
  onClose,
  databaseId,
}: InputConfigEditModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [inputColumns, setInputColumns] = useState<
    InputConfigListProps["value"]
  >([]);

  const {
    data: getConfigRes,
    error: getConfigError,
    mutate: getConfigMutate,
  } = useGetConfig(getAccessToken, {
    databaseId,
  });

  const fetchError = getConfigError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } = extractErrorMessageFromFetchError(
        fetchError
      );
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  const initializeInputColumns = (
    getConfigRes: ReturnType<typeof useGetConfig>["data"]
  ) => {
    setInputColumns(
      getConfigRes?.columns.map((column) => ({
        name: column.name,
        display_name: column.display_name,
        necessity: column.necessity || "unnecessary",
        order_of_input: column.order_of_input,
      })) || []
    );
  };
  useEffect(() => {
    initializeInputColumns(getConfigRes);
  }, [getConfigRes]);

  const initializeState = () => {
    initializeInputColumns(getConfigRes);
    setIsSaving(false);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onSave = async () => {
    if (getConfigRes && inputColumns) {
      setIsSaving(true);

      const newDatabaseConfig = produce(getConfigRes, (draft) => {
        // update existing columns
        draft.columns = getConfigRes.columns.map((oldColumn) => {
          const newColumn = inputColumns.find(
            (column) => column.name === oldColumn.name
          );
          return { ...oldColumn, ...newColumn };
        });

        // add new columns
        const addedColumns = inputColumns
          .filter((column) => {
            const existingNames = getConfigRes.columns.map(
              (column) => column.name
            );
            return !existingNames.includes(column.name);
          })
          .map((column) => ({
            name: column.name,
            display_name: column.display_name,
            necessity: column.necessity,
            order_of_input: column.order_of_input,
            dtype: "string" as const,
            aggregation: "first" as const,
          }));
        draft.columns = draft.columns.concat(addedColumns);
      });

      const [updateConfigRes, updateConfigError] = await fetchMetaStore(
        getAccessToken,
        metaStore.ConfigService.updateConfig,
        {
          databaseId,
          requestBody: newDatabaseConfig,
        }
      );

      if (updateConfigError) {
        const { reason, instruction } = extractErrorMessageFromFetchError(
          updateConfigError
        );
        setError({ reason, instruction });
      } else {
        getConfigMutate(updateConfigRes);
      }

      setIsSaving(false);
    }
    onClose();
  };

  const isFetchComplete = Boolean(!fetchError && getConfigRes);
  const nonInputColumns = (getConfigRes?.columns
    .filter(
      (column) =>
        isEditableColumnName(getConfigRes, column.name) &&
        (column.necessity == null || column.necessity === "unnecessary")
    )
    ?.map((column) => ({
      display_name: column.display_name,
      name: column.name,
    })) || []) as {
    name: string;
    display_name: string;
  }[];

  return (
    <InputConfigEditPresentation
      error={error}
      inputColumns={inputColumns}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      nonInputColumns={nonInputColumns}
      onChangeInputColumns={setInputColumns}
      onClose={onClose}
      onSave={onSave}
      open={open}
    />
  );
};
