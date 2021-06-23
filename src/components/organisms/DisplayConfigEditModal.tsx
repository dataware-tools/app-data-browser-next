import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import {
  useGetConfig,
  usePrevious,
  DatabaseConfigType,
  fetchMetaStore,
  compStr,
} from "utils/index";
import {
  DisplayConfigList,
  DisplayConfigListProps,
} from "components/organisms/DisplayConfigList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogWrapper,
  DialogContainer,
  DialogBody,
  DialogMain,
  DialogTitle,
  DialogToolBar,
  DialogCloseButton,
  SquareIconButton,
  TextCenteringSpan,
  // NoticeableLetters,
} from "@dataware-tools/app-common";
import { produce } from "immer";
import { mutate } from "swr";

type ConfigNameType = "record_list_display_columns";

type ContainerProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
  configName: ConfigNameType;
};

const title = { record_list_display_columns: "Record Display Fields" };

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
  configName,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const [displayColumnOptions, setDisplayColumnOptions] = useState<
    OptionType[]
  >([]);
  const [usedDisplayColumnOptions, setUsedDisplayColumnOptions] = useState<
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
      const newDatabaseConfig = produce(getConfigRes, (draft) => {
        draft.columns = draft.columns.map((column) => ({
          ...column,
          is_display_field: displayColumns.includes(column.name),
        }));

        draft.columns.sort((a, b) => {
          if (
            displayColumns.includes(a.name) &&
            displayColumns.includes(b.name)
          ) {
            return (
              displayColumns.indexOf(a.name) - displayColumns.indexOf(b.name)
            );
          } else if (displayColumns.includes(a.name)) {
            return -1;
          } else if (displayColumns.includes(b.name)) {
            return 1;
          } else {
            return compStr(a.name, b.name);
          }
        });
      });

      const [data, error] = await fetchMetaStore(
        getAccessToken,
        metaStore.ConfigService.updateConfig,
        {
          databaseId,
          requestBody: newDatabaseConfig,
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
    setDisplayColumns((prev) => {
      return prev ? [...prev, ""] : [""];
    });

  const onChange: DisplayConfigListProps["onChange"] = (
    action,
    index,
    newValue,
    oldValue
  ) => {
    if (action === "change") {
      setDisplayColumns((prev) => {
        const newConfig = produce(prev, (draft) => {
          draft[index] = newValue;
        });
        return newConfig;
      });

      setUsedDisplayColumnOptions((prev) => {
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
      setDisplayColumns((prev) => {
        const newConfig = produce(prev, (draft) => {
          draft.splice(index, 1);
        });
        return newConfig;
      });

      setUsedDisplayColumnOptions((prev) => {
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
      setDisplayColumns(
        getConfigRes.columns
          .filter((column) => column.is_display_field)
          .map((column) => column.name) || []
      );

      setDisplayColumnOptions(
        getConfigRes.columns
          .map((column) => ({
            label: `${column.name} (display name: ${column.display_name})`,
            value: column.name,
          }))
          .sort(compareOption)
      );

      setUsedDisplayColumnOptions(
        getConfigRes.columns
          .filter((column) => column.is_display_field)
          .map((column) => column.name) || []
      );
    }
  }, [getConfigRes]);

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          {/* //TODO:Fix typeError */}
          {/* <NoticeableLetters> */}
          <TextCenteringSpan>{title[configName] + " "}</TextCenteringSpan>
          {/* </NoticeableLetters> */}
          {getConfigRes ? (
            <SquareIconButton onClick={onAdd} icon={<AddCircleIcon />} />
          ) : null}
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          <DialogBody>
            {getConfigError ? (
              <ErrorMessage
                reason={JSON.stringify(getConfigError)}
                instruction="please reload this page"
              />
            ) : getConfigRes ? (
              displayColumnOptions.length <= 0 ? (
                <ErrorMessage
                  reason="no available column"
                  instruction="please add data or input field"
                />
              ) : (
                <>
                  <DialogMain>
                    <DisplayConfigList
                      value={displayColumns}
                      onChange={onChange}
                      options={displayColumnOptions}
                      alreadySelectedOptions={usedDisplayColumnOptions}
                    />
                  </DialogMain>
                  <DialogToolBar
                    right={
                      <LoadingButton
                        disabled={
                          displayColumns.length <= 0 ||
                          displayColumns.includes("")
                        }
                        pending={isSaving}
                        onClick={onSave}
                      >
                        Save
                      </LoadingButton>
                    }
                  />
                </>
              )
            ) : null}
          </DialogBody>
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export { Container as DisplayConfigEditModal };
export type { ContainerProps as DisplayConfigEditModalProps, ConfigNameType };
