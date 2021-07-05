import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useGetConfig, fetchMetaStore } from "utils/index";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogCloseButton,
  DialogTitle,
  DialogBody,
  DialogContainer,
  DialogToolBar,
  DialogWrapper,
  DialogMain,
  ErrorMessageProps,
  usePrevious,
  NoticeableLetters,
  LoadingIndicator,
} from "@dataware-tools/app-common";
import { produce } from "immer";
import { mutate } from "swr";
import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "components/organisms/OptionSharingSelects";

type ConfigNameType = "secret_columns";

type Props = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  onChangeSecretColumns: OptionSharingSelectsProps["onChange"];
  secretColumnsOptions: OptionSharingSelectsProps["options"];
  secretColumns: OptionSharingSelectsProps["values"];
  isDisableSaveButton: boolean;
  isSaving: boolean;
  onSave: () => void;
} & Omit<ContainerProps, "databaseId">;

type ContainerProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
};

const Component = ({
  open,
  onClose,
  error,
  isFetchComplete,
  onChangeSecretColumns,
  secretColumnsOptions,
  secretColumns,
  isDisableSaveButton,
  isSaving,
  onSave,
}: Props) => {
  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <NoticeableLetters>Search target columns</NoticeableLetters>
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          {error ? (
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
                    pending={isSaving}
                    onClick={onSave}
                  >
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
const Container = ({
  open,
  onClose,
  databaseId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [secretColumns, setSecretColumns] = useState<string[]>([]);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

  const {
    data: getConfigRes,
    error: getConfigError,
    cacheKey: getConfigCacheKey,
  } = useGetConfig(getAccessToken, {
    databaseId,
  });

  const initializeState = () => {
    setIsSaving(false);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const fetchError = getConfigError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: JSON.stringify(fetchError),
        instruction: "Please reload this page",
      });
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
        setError({
          reason: error?.body?.detail || JSON.stringify(error?.body || error),
          instruction: "Please reload this page",
        });
      } else {
        mutate(getConfigCacheKey, data);
      }

      setIsSaving(false);
    }
    onClose();
  };

  const secretColumnsOptions =
    getConfigRes?.columns.map((column) => ({
      label: `${column.name} (display name: ${column.display_name})`,
      value: column.name,
    })) || [];
  const isFetchComplete = Boolean(!fetchError && getConfigRes);
  const isDisableSaveButton = secretColumns.includes("");

  return (
    <Component
      isDisableSaveButton={isDisableSaveButton}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      onChangeSecretColumns={setSecretColumns}
      onClose={onClose}
      onSave={onSave}
      open={open}
      secretColumns={secretColumns}
      secretColumnsOptions={secretColumnsOptions}
      error={error}
    />
  );
};

export { Container as SecretConfigEditModal };
export type { ContainerProps as SecretConfigEditModalProps, ConfigNameType };
