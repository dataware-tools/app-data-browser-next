import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogBody,
  DialogToolBar,
  DialogMain,
  LoadingIndicator,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { produce } from "immer";
import { useState, useEffect } from "react";

import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "components/organisms/OptionSharingSelects";
import { useGetConfig, fetchMetaStore } from "utils";

export type ConfigNameType = "record_search_target_columns";

export type SearchFieldsConfigBodyPresentationProps = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  onChangeSearchTargetColumns: OptionSharingSelectsProps["onChange"];
  searchTargetColumnsOptions: OptionSharingSelectsProps["options"];
  searchTargetColumns: OptionSharingSelectsProps["values"];
  isDisableSaveButton: boolean;
  isSaving: boolean;
  onSave: () => void;
} & Omit<SearchFieldsConfigBodyProps, "databaseId">;

export type SearchFieldsConfigBodyProps = {
  databaseId: string;
};

export const SearchFieldsConfigBodyPresentation = ({
  error,
  isFetchComplete,
  onChangeSearchTargetColumns,
  searchTargetColumnsOptions,
  searchTargetColumns,
  isDisableSaveButton,
  isSaving,
  onSave,
}: SearchFieldsConfigBodyPresentationProps): JSX.Element => {
  return error ? (
    <ErrorMessage {...error} />
  ) : isFetchComplete ? (
    <DialogBody>
      <DialogMain>
        <OptionSharingSelects
          onChange={onChangeSearchTargetColumns}
          options={searchTargetColumnsOptions}
          values={searchTargetColumns}
          creatable
          deletable
        />
      </DialogMain>
      <DialogToolBar
        right={
          <LoadingButton
            disabled={isDisableSaveButton}
            loading={isSaving}
            onClick={onSave}
          >
            Save
          </LoadingButton>
        }
      />
    </DialogBody>
  ) : (
    <LoadingIndicator />
  );
};

export const SearchFieldsConfigBody = ({
  databaseId,
}: SearchFieldsConfigBodyProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [searchTargetColumns, setSearchTargetColumns] = useState<string[]>([]);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

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
    }
  }, [fetchError]);

  useEffect(() => {
    setSearchTargetColumns(
      getConfigRes?.columns
        .filter((column) => column.is_search_target)
        .map((column) => column.name) || []
    );

    if (getConfigRes && getConfigRes.columns.length <= 0) {
      setError({
        reason: "No available column",
        instruction: "Please add data or input field",
      });
    } else {
      setError(undefined);
    }
  }, [getConfigRes]);

  const onSave = async () => {
    if (getConfigRes) {
      setIsSaving(true);
      const newConfig = produce(getConfigRes, (draft) => {
        draft.columns = draft.columns.map((column) => ({
          ...column,
          is_search_target: searchTargetColumns.includes(column.name),
        }));
      });

      const [updateConfigRes, updateConfigError] = await fetchMetaStore(
        getAccessToken,
        metaStore.ConfigService.updateConfig,
        {
          databaseId,
          requestBody: newConfig,
        }
      );

      if (updateConfigError) {
        const { reason, instruction } = extractErrorMessageFromFetchError(
          updateConfigError
        );
        setError({ reason, instruction });
        return;
      } else {
        getConfigMutate(updateConfigRes);
      }

      setIsSaving(false);
    }
  };

  const searchTargetColumnsOptions =
    getConfigRes?.columns.map((column) => ({
      label: `${column.name} (display name: ${column.display_name})`,
      value: column.name,
    })) || [];
  const isFetchComplete = Boolean(!fetchError && getConfigRes);
  const isDisableSaveButton =
    searchTargetColumns.length <= 0 || searchTargetColumns.includes("");

  return (
    <SearchFieldsConfigBodyPresentation
      isDisableSaveButton={isDisableSaveButton}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      onChangeSearchTargetColumns={setSearchTargetColumns}
      onSave={onSave}
      searchTargetColumns={searchTargetColumns}
      searchTargetColumnsOptions={searchTargetColumnsOptions}
      error={error}
    />
  );
};
