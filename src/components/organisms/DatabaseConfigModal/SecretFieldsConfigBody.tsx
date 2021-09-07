import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogBody,
  DialogToolBar,
  DialogMain,
  ErrorMessageProps,
  LoadingIndicator,
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

export type ConfigNameType = "secret_columns";

export type SecretFieldsConfigBodyPresentationProps = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  onChangeSecretColumns: OptionSharingSelectsProps["onChange"];
  secretColumnsOptions: OptionSharingSelectsProps["options"];
  secretColumns: OptionSharingSelectsProps["values"];
  isDisableSaveButton: boolean;
  isSaving: boolean;
  onSave: () => void;
} & Omit<SecretFieldsConfigBodyProps, "databaseId">;

export type SecretFieldsConfigBodyProps = {
  databaseId: string;
};

export const SecretFieldsConfigBodyPresentation = ({
  error,
  isFetchComplete,
  onChangeSecretColumns,
  secretColumnsOptions,
  secretColumns,
  isDisableSaveButton,
  isSaving,
  onSave,
}: SecretFieldsConfigBodyPresentationProps): JSX.Element => {
  return error ? (
    <ErrorMessage {...error} />
  ) : isFetchComplete ? (
    <DialogBody>
      <DialogMain>
        <OptionSharingSelects
          onChange={onChangeSecretColumns}
          options={secretColumnsOptions}
          values={secretColumns}
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

export const SecretFieldsConfigBody = ({
  databaseId,
}: SecretFieldsConfigBodyProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [secretColumns, setSecretColumns] = useState<string[]>([]);
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
    setSecretColumns(
      getConfigRes?.columns
        ?.filter((column) => column.is_secret)
        ?.map((column) => column.name) || []
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
    if (getConfigRes?.columns) {
      setIsSaving(true);
      const newConfig = produce(getConfigRes, (draft) => {
        draft.columns = draft.columns.map((column) => ({
          ...column,
          is_secret: secretColumns.includes(column.name),
        }));
      });

      const [data, error] = await fetchMetaStore(
        getAccessToken,
        metaStore.ConfigService.updateConfig,
        {
          databaseId,
          requestBody: newConfig,
        }
      );

      if (error) {
        const { reason, instruction } = extractErrorMessageFromFetchError(
          error
        );
        setError({ reason, instruction });
      } else {
        getConfigMutate(data);
      }

      setIsSaving(false);
    }
  };

  const secretColumnsOptions =
    getConfigRes?.columns.map((column) => ({
      label: `${column.name} (display name: ${column.display_name})`,
      value: column.name,
    })) || [];
  const isFetchComplete = Boolean(!fetchError && getConfigRes);
  const isDisableSaveButton = secretColumns.includes("");

  return (
    <SecretFieldsConfigBodyPresentation
      isDisableSaveButton={isDisableSaveButton}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      onChangeSecretColumns={setSecretColumns}
      onSave={onSave}
      secretColumns={secretColumns}
      secretColumnsOptions={secretColumnsOptions}
      error={error}
    />
  );
};
