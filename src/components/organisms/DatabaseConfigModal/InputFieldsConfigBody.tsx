import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  ErrorMessage,
  DialogToolBar,
  DialogBody,
  DialogMain,
  LoadingIndicator,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import LoadingButton from "@mui/lab/LoadingButton";
import { produce } from "immer";
import { useState, useEffect } from "react";
import {
  InputConfigList,
  InputConfigListProps,
} from "components/organisms/InputConfigList";
import { useGetConfig, fetchMetaStore, isEditableColumnName } from "utils";

export type ConfigNameType = "record_add_editable_columns";

export type InputFieldsConfigBodyPresentationProps = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  inputColumns: InputConfigListProps["value"];
  nonInputColumns: InputConfigListProps["restColumns"];
  onChangeInputColumns: InputConfigListProps["onChange"];
  isSaving: boolean;
  onSave: () => void;
} & Omit<InputFieldsConfigBodyProps, "databaseId">;

export type InputFieldsConfigBodyProps = {
  databaseId: string;
};

export const InputFieldsConfigBodyPresentation = ({
  error,
  isFetchComplete,
  inputColumns,
  nonInputColumns,
  onChangeInputColumns,
  isSaving,
  onSave,
}: InputFieldsConfigBodyPresentationProps): JSX.Element => {
  return error ? (
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
  );
};

export const InputFieldsConfigBody = ({
  databaseId,
}: InputFieldsConfigBodyProps): JSX.Element => {
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
        is_secret: column.is_secret || false,
        order_of_input: column.order_of_input,
      })) || []
    );
  };
  useEffect(() => {
    initializeInputColumns(getConfigRes);
  }, [getConfigRes]);

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
            is_secret: column.is_secret,
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
    <InputFieldsConfigBodyPresentation
      error={error}
      inputColumns={inputColumns}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      nonInputColumns={nonInputColumns}
      onChangeInputColumns={setInputColumns}
      onSave={onSave}
    />
  );
};
