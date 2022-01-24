import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  DialogWrapper,
  DialogContainer,
  DialogCloseButton,
  usePrevious,
  DialogTabBar,
  DialogTitle,
  NoticeableLetters,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
  DialogBody,
  LoadingIndicator,
  ErrorMessage,
  DialogToolBar,
  confirm,
  useConfirmClosingWindow,
} from "@dataware-tools/app-common";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import equal from "fast-deep-equal";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { databaseConfigState } from "./DatabaseConfigState";
import { DisplayFieldsConfigBody } from "./DisplayFieldsConfigBody";
import { InputFieldsConfigBody } from "./InputFieldsConfigBody";
import { SearchFieldsConfigBody } from "./SearchFieldsConfigBody";
import { SecretFieldsConfigBody } from "./SecretFieldsConfigBody";
import { fetchMetaStore, useGetConfig } from "utils";

export type ConfigNameType = "record_list_display_columns";

export type DatabaseConfigModalPresentationProps = {
  tabIndex: number;
  tabNames: string[];
  onTabChange: (tabIndex: number) => void;
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  isDisableSaveButton: LoadingButtonProps["disabled"];
  isSaving: LoadingButtonProps["loading"];
  onSave: LoadingButtonProps["onClick"];
  onClose: (reason?: string) => void;
} & Omit<DatabaseConfigModalProps, "onClose">;

export type DatabaseConfigModalProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
};

export const DatabaseConfigModalPresentation = ({
  open,
  tabIndex,
  tabNames,
  onTabChange,
  onClose,
  error,
  isFetchComplete,
  isDisableSaveButton,
  isSaving,
  onSave,
}: DatabaseConfigModalPresentationProps): JSX.Element => {
  return (
    <Dialog open={open} maxWidth="xl" onClose={(_, reason) => onClose(reason)}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <NoticeableLetters>Configure database</NoticeableLetters>
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          <DialogTabBar
            value={tabIndex}
            tabNames={tabNames}
            onChange={onTabChange}
          />
          <DialogBody>
            {error ? (
              <ErrorMessage {...error} />
            ) : isFetchComplete ? (
              <>
                {tabIndex === 0 ? (
                  <InputFieldsConfigBody />
                ) : tabIndex === 1 ? (
                  <DisplayFieldsConfigBody />
                ) : tabIndex === 2 ? (
                  <SearchFieldsConfigBody />
                ) : tabIndex === 3 ? (
                  <SecretFieldsConfigBody />
                ) : null}
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
              </>
            ) : (
              <LoadingIndicator />
            )}
          </DialogBody>
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export const DatabaseConfigModal = ({
  open,
  onClose: propsOnClose,
  databaseId,
}: DatabaseConfigModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [databaseConfig, setDatabaseConfig] =
    useRecoilState(databaseConfigState);
  const [tabIndex, setTabIndex] = useState(0);

  const {
    data: getDatabaseConfigRes,
    error: getConfigError,
    mutate: getConfigMutate,
  } = useGetConfig(getAccessToken, {
    databaseId,
  });

  useEffect(() => {
    if (getDatabaseConfigRes) {
      setDatabaseConfig(getDatabaseConfigRes);
    }
  }, [getDatabaseConfigRes, setDatabaseConfig]);

  const fetchError = getConfigError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } =
        extractErrorMessageFromFetchError(fetchError);
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  const {
    addEventListener: addEventListenerForConfirmClosingWindow,
    removeEventListener: removeEventListenerForConfirmClosingWindow,
  } = useConfirmClosingWindow(() => {
    if (!equal(databaseConfig, getDatabaseConfigRes)) {
      return true;
    }

    return false;
  });

  const initializeState = () => {
    setTabIndex(0);
    setDatabaseConfig(getDatabaseConfigRes);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
      addEventListenerForConfirmClosingWindow();
    }
  }, [open, prevOpen, initializeState]);

  const tabNames = [
    "Input fields",
    "Display fields",
    "Search fields",
    "Secret fields",
  ];

  const onSave = async () => {
    setIsSaving(true);
    const [updateConfigRes, updateConfigError] = await fetchMetaStore(
      getAccessToken,
      metaStore.ConfigService.updateConfig,
      {
        databaseId,
        requestBody: databaseConfig,
      }
    );

    if (updateConfigError) {
      const { reason, instruction } =
        extractErrorMessageFromFetchError(updateConfigError);
      setError({ reason, instruction });
    } else {
      getConfigMutate(updateConfigRes);
    }
    setIsSaving(false);
    propsOnClose();
  };

  const isFetchComplete = Boolean(!fetchError && databaseConfig);
  const isDisableSaveButton = false;

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
        if (!equal(databaseConfig, getDatabaseConfigRes)) {
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
    <DatabaseConfigModalPresentation
      databaseId={databaseId}
      onClose={onClose}
      open={open}
      onTabChange={setTabIndex}
      tabIndex={tabIndex}
      tabNames={tabNames}
      error={error}
      isDisableSaveButton={isDisableSaveButton}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      onSave={onSave}
    />
  );
};
