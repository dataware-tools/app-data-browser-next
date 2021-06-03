import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import {
  DatabaseConfigType,
  useGetConfig,
  usePrevious,
  fetchAPI,
} from "utils/index";
import {
  InputConfigList,
  InputConfigListProps,
} from "components/organisms/InputConfigList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { SquareIconButton } from "components/atoms/SquareIconButton";
import { DialogTitle } from "components/atoms/DialogTitle";
import { TextCenteringSpan } from "components/atoms/TextCenteringSpan";
import { DialogContainer } from "components/atoms/DialogContainer";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogToolBar } from "components/atoms/DialogToolBar";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorMessage, metaStore } from "@dataware-tools/app-common";
import {
  InputConfigAddModal,
  InputConfigAddModalProps,
} from "components/organisms/InputConfigAddModal";
import { produce } from "immer";

import { mutate } from "swr";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  databaseId: string;
  configName: "record_input_config";
};

const title = { record_input_config: "Record Input Fields" };

const Container = ({
  open,
  onClose,
  configName,
  databaseId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [config, setConfig] = useState<InputConfigListProps["value"] | null>(
    null
  );
  const [options, setOptions] = useState<
    { name: string; display_name: string }[] | null
  >(null);

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

  useEffect(() => {
    setConfig(
      getConfigRes?.data_browser_config?.[configName]?.map((config) => ({
        ...config,
        display_name:
          getConfigRes.columns.find((column) => column.name === config.name)
            ?.display_name || "",
      })) || [
        {
          name: "record_name",
          display_name: "Record name",
          necessity: "required",
        },
      ]
    );

    setOptions(
      (getConfigRes?.columns
        .map((column) => {
          if (column.name.startsWith("_")) {
            return undefined;
          } else if (
            getConfigRes.data_browser_config?.record_input_config
              ?.map((el) => el.name)
              .includes(column.name)
          ) {
            return undefined;
          } else {
            return {
              display_name: column.display_name,
              name: column.name,
            };
          }
        })
        .filter((c) => c) || []) as { name: string; display_name: string }[]
    );
  }, [getConfigRes, configName]);

  const initializeState = () => {
    setIsSaving(false);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onSave = async () => {
    if (getConfigRes && config) {
      setIsSaving(true);
      const newInputConfig = config.map((value) => ({
        name: value.name,
        necessity: value.necessity,
      }));

      const existingNames = getConfigRes.columns.map((column) => column.name);
      const newColumns = getConfigRes.columns
        .map((oldColumn) => {
          const newColumn = config.find(
            (value) => value.name === oldColumn.name
          );
          return newColumn
            ? {
                ...oldColumn,
                name: newColumn.name,
                display_name: newColumn.display_name,
              }
            : oldColumn;
        })
        .concat(
          config
            .filter((value) => !existingNames.includes(value.name))
            .map((value) => ({
              name: value.name,
              display_name: value.display_name,
              dtype: "string",
              aggregation: "first",
            }))
        );

      const newConfig = produce(getConfigRes, (draft) => {
        draft.columns = newColumns;
        if (draft.data_browser_config) {
          draft.data_browser_config.record_input_config = newInputConfig;
        } else {
          draft.data_browser_config = {
            record_input_config: newInputConfig,
          };
        }
      });

      const [data, error] = await fetchAPI(
        getAccessToken,
        metaStore.ConfigService.updateConfig,
        {
          databaseId,
          requestBody: newConfig,
        }
      );

      if (error) {
        // TODO: show error
      } else {
        mutate(getConfigCacheKey, data);
      }

      setIsSaving(false);
    }
    onClose();
  };

  const onAdd: InputConfigAddModalProps["onSave"] = (newConfig) => {
    setConfig((prev) => (prev ? [...prev, newConfig] : [newConfig]));
    setOptions((prev) => {
      if (prev) {
        const newOption = produce(prev, (prev) => {
          prev.splice(prev.findIndex((elem) => elem.name === newConfig.name));
        });
        return newOption;
      } else {
        return prev;
      }
    });
  };

  const onChange: InputConfigListProps["onChange"] = (
    index,
    action,
    newValue
  ) => {
    if (getConfigRes && config) {
      if (action === "delete") {
        setConfig(config.filter((_, i) => i !== index));
        setOptions((prev) => {
          if (prev) {
            const newOptions = produce(prev, (prev) => {
              prev.push({
                name: newValue.name,
                display_name: newValue.display_name,
              });
            });
            return newOptions;
          } else {
            return [
              { name: newValue.name, display_name: newValue.display_name },
            ];
          }
        });
      } else if (action === "change") {
        setConfig(
          config.map((oldValue, i) => (i === index ? newValue : oldValue))
        );
      }
    }
  };
  const blackListForDisplayName = [
    ...new Set(getConfigRes?.columns.map((column) => column.display_name)),
  ];

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <TextCenteringSpan>{title[configName] + " "}</TextCenteringSpan>
          {getConfigRes ? (
            <SquareIconButton
              onClick={() => setOpenAddModal(true)}
              icon={<AddCircleIcon />}
            />
          ) : null}
        </DialogTitle>
        {getConfigError ? (
          <ErrorMessage
            reason={JSON.stringify(getConfigError)}
            instruction="please reload this page"
          />
        ) : getConfigRes && config ? (
          <>
            <DialogBody>
              <InputConfigList value={config} onChange={onChange} />
            </DialogBody>
            <DialogToolBar
              right={
                <LoadingButton pending={isSaving} onClick={onSave}>
                  Save
                </LoadingButton>
              }
            />
          </>
        ) : null}
        {options ? (
          <InputConfigAddModal
            options={options}
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onSave={(newConfig) => onAdd(newConfig)}
            blackListForDisplayName={blackListForDisplayName}
          />
        ) : null}
      </DialogContainer>
    </Dialog>
  );
};

export { Container as InputConfigEditModal };
export type { ContainerProps as InputConfigEditModalProps };
