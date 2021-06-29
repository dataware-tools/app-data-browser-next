import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useGetConfig, DatabaseConfigType, fetchMetaStore } from "utils/index";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogCloseButton,
  DialogTitle,
  DialogBody,
  DialogContainer,
  DialogToolBar,
  TextCenteringSpan,
  DialogWrapper,
  DialogMain,
  ErrorMessageProps,
  usePrevious,
} from "@dataware-tools/app-common";
import { produce } from "immer";
import { mutate } from "swr";
import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "components/organisms/OptionSharingSelects";

type ConfigNameType = "secret_columns";

type ContainerProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
};

const Container = ({
  open,
  onClose,
  databaseId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<string[]>([]);
  const [options, setOptions] = useState<
    OptionSharingSelectsProps["options"] | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessageProps | null>(
    null
  );

  const [getConfigRes, getConfigError, getConfigCacheKey] = (useGetConfig(
    getAccessToken,
    {
      databaseId,
    }
  ) as unknown) as [
    data: DatabaseConfigType | undefined,
    error: any,
    cacheKey: string
  ];

  const initializeState = () => {
    setIsSaving(false);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onSave = async () => {
    if (getConfigRes?.columns) {
      setIsSaving(true);
      const newConfig = produce(getConfigRes, (draft) => {
        draft.columns = draft.columns.map((column) => ({
          ...column,
          is_secret: config.includes(column.name),
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
        setErrorMessage({
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

  useEffect(() => {
    setConfig(
      getConfigRes?.columns
        ?.filter((column) => column.is_secret)
        ?.map((column) => column.name) || []
    );
  }, [getConfigRes]);

  useEffect(() => {
    if (getConfigRes?.columns) {
      const options = getConfigRes.columns.map((column) => ({
        label: `${column.name} (display name: ${column.display_name})`,
        value: column.name,
      }));
      setOptions(options.length > 0 ? options : null);
    }
  }, [getConfigRes]);

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <TextCenteringSpan>Secret columns</TextCenteringSpan>
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          {getConfigError ? (
            <ErrorMessage
              reason={JSON.stringify(getConfigError)}
              instruction="please reload this page"
            />
          ) : errorMessage ? (
            <ErrorMessage {...errorMessage} />
          ) : getConfigRes ? (
            options == null ? (
              <ErrorMessage
                reason="No available column"
                instruction="Please add data or configure input field"
              />
            ) : (
              <DialogBody>
                <DialogMain>
                  <OptionSharingSelects
                    options={options}
                    onChange={(newConfig) => {
                      setConfig(newConfig);
                    }}
                    values={config}
                    creatable
                    deletable
                  />
                </DialogMain>
                <DialogToolBar
                  right={
                    <LoadingButton
                      disabled={config.includes("")}
                      pending={isSaving}
                      onClick={onSave}
                    >
                      Save
                    </LoadingButton>
                  }
                />
              </DialogBody>
            )
          ) : null}
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export { Container as SecretConfigEditModal };
export type { ContainerProps as SecretConfigEditModalProps, ConfigNameType };
