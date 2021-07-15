import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import {
  useGetConfig,
  fetchMetaStore,
  extractReasonFromFetchError,
} from "utils";
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
  usePrevious,
  NoticeableLetters,
  LoadingIndicator,
  ErrorMessageProps,
} from "@dataware-tools/app-common";
import { produce } from "immer";

import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "components/organisms/OptionSharingSelects";

type ConfigNameType = "record_search_target_columns";

type Props = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  onChangeSearchTargetColumns: OptionSharingSelectsProps["onChange"];
  searchTargetColumnsOptions: OptionSharingSelectsProps["options"];
  searchTargetColumns: OptionSharingSelectsProps["values"];
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
  onChangeSearchTargetColumns,
  searchTargetColumnsOptions,
  searchTargetColumns,
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
  const [searchTargetColumns, setSearchTargetColumns] = useState<string[]>([]);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

  const {
    data: getConfigRes,
    error: getConfigError,
    mutate: getConfigMutate,
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
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload this page",
      });
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
        setError({
          reason: extractReasonFromFetchError(updateConfigError),
          instruction: "Please reload this page",
        });
        return;
      } else {
        getConfigMutate(updateConfigRes);
      }

      setIsSaving(false);
    }
    onClose();
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
    <Component
      isDisableSaveButton={isDisableSaveButton}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      onChangeSearchTargetColumns={setSearchTargetColumns}
      onClose={onClose}
      onSave={onSave}
      open={open}
      searchTargetColumns={searchTargetColumns}
      searchTargetColumnsOptions={searchTargetColumnsOptions}
      error={error}
    />
  );
};

export { Container as SearchConfigEditModal };
export type { ContainerProps as SearchConfigEditModalProps, ConfigNameType };
