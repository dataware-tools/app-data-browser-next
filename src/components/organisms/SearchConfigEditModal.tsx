import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useGetConfig, DatabaseConfigType, fetchMetaStore } from "utils/index";
import {
  SearchConfigList,
  SearchConfigListProps,
} from "components/organisms/SearchConfigList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogCloseButton,
  DialogTitle,
  DialogBody,
  DialogContainer,
  DialogToolBar,
  SquareIconButton,
  TextCenteringSpan,
  DialogWrapper,
  DialogMain,
  usePrevious,
  // NoticeableLetters,
} from "@dataware-tools/app-common";
import { produce } from "immer";
import { mutate } from "swr";

type ConfigNameType = "record_search_target_columns";

type ContainerProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
};

type OptionType = { label: string; value: string };
const compareOption = (a: OptionType, b: OptionType) => {
  if (a.label > b.label) {
    return 1;
  } else if (a.label < b.label) {
    return -1;
  } else {
    return 0;
  }
};

const Container = ({
  open,
  onClose,
  databaseId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<string[]>([]);
  const [options, setOptions] = useState<OptionType[] | null>(null);
  const [alreadySelectedOptions, setAlreadySelectedOptions] = useState<
    string[]
  >([]);

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
      getConfigRes?.columns
        .filter((column) => column.is_search_target)
        .map((column) => column.name) || []
    );
  }, [getConfigRes]);

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
    if (getConfigRes) {
      setIsSaving(true);
      const newConfig = produce(getConfigRes, (draft) => {
        draft.columns = draft.columns.map((column) => ({
          ...column,
          is_search_target: config.includes(column.name),
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
        // TODO: show error
      } else {
        mutate(getConfigCacheKey, data);
      }

      setIsSaving(false);
    }
    onClose();
  };

  const onAdd = () =>
    setConfig((prev) => {
      return prev ? [...prev, ""] : [""];
    });

  const onChange: SearchConfigListProps["onChange"] = (
    action,
    index,
    newValue,
    oldValue
  ) => {
    if (action === "change") {
      setConfig((prev) => {
        const newConfig = produce(prev, (draft) => {
          draft[index] = newValue;
        });
        return newConfig;
      });

      setAlreadySelectedOptions((prev) => {
        if (prev) {
          const next = produce(prev, (draft) => {
            if (draft.includes(oldValue)) {
              draft.splice(draft.indexOf(oldValue), 1);
            }
            if (!draft.includes(newValue)) {
              draft.push(newValue);
            }
          });

          return next;
        }
        return [newValue];
      });
    }

    if (action === "delete") {
      setConfig((prev) => {
        const newConfig = produce(prev, (draft) => {
          draft.splice(index, 1);
        });
        return newConfig;
      });

      setAlreadySelectedOptions((prev) => {
        if (prev) {
          if (prev.includes(oldValue)) {
            const next = produce(prev, (draft) => {
              draft.splice(draft.indexOf(oldValue), 1);
            });
            return next;
          } else {
            return prev;
          }
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    if (getConfigRes) {
      const options = getConfigRes.columns
        .map((column) => ({
          label: `${column.name} (display name: ${column.display_name})`,
          value: column.name,
        }))
        .sort(compareOption);
      setOptions(options.length > 0 ? options : null);

      setAlreadySelectedOptions(
        getConfigRes.columns
          .filter((column) => column.is_search_target)
          .map((column) => column.name) || []
      );
    }
  }, [getConfigRes]);

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          {/* //TODO: Fix typeError */}
          {/* <NoticeableLetters> */}
          <TextCenteringSpan>Search target columns</TextCenteringSpan>
          {/* </NoticeableLetters> */}
          {getConfigRes ? (
            <SquareIconButton onClick={onAdd} icon={<AddCircleIcon />} />
          ) : null}
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          {getConfigError ? (
            <ErrorMessage
              reason={JSON.stringify(getConfigError)}
              instruction="please reload this page"
            />
          ) : getConfigRes ? (
            options == null ? (
              <ErrorMessage
                reason="no available column"
                instruction="please add data or input field"
              />
            ) : (
              <DialogBody>
                <DialogMain>
                  <SearchConfigList
                    value={config}
                    onChange={onChange}
                    options={options}
                    alreadySelectedOptions={alreadySelectedOptions}
                  />
                </DialogMain>
                <DialogToolBar
                  right={
                    <LoadingButton
                      disabled={config.length <= 0 || config.includes("")}
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

export { Container as SearchConfigEditModal };
export type { ContainerProps as SearchConfigEditModalProps, ConfigNameType };
