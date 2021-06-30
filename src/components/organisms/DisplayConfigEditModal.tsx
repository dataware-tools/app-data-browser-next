import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Dialog from "@material-ui/core/Dialog";
import { produce } from "immer";
import { mutate } from "swr";
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
  DialogSubTitle,
  NoticeableLetters,
  usePrevious,
  ErrorMessageProps,
} from "@dataware-tools/app-common";
import LoadingButton, {
  LoadingButtonProps,
} from "@material-ui/lab/LoadingButton";
import { SoloSelect, SoloSelectProps } from "components/molecules/SoloSelect";
import {
  useGetConfig,
  DatabaseConfigType,
  fetchMetaStore,
  compStr,
} from "utils/index";
import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "./OptionSharingSelects";

type ConfigNameType = "record_list_display_columns";

type Props = {
  error?: ErrorMessageProps;
  onChangeDisplayColumns: OptionSharingSelectsProps["onChange"];
  displayColumns: OptionSharingSelectsProps["values"];
  displayColumnsOptions: OptionSharingSelectsProps["options"];
  isFetchComplete: boolean;
  onChangeRecordTitleColumn: SoloSelectProps["onChange"];
  recordTitleColumn: SoloSelectProps["value"];
  recordTitleColumnOptions: SoloSelectProps["options"];
  isDisableSaveButton: LoadingButtonProps["disabled"];
  isSaving: LoadingButtonProps["pending"];
  onSave: LoadingButtonProps["onClick"];
} & ContainerProps;

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

const Component = ({
  open,
  onClose,
  error,
  onChangeDisplayColumns,
  displayColumnsOptions,
  displayColumns,
  isFetchComplete,
  onChangeRecordTitleColumn,
  recordTitleColumn,
  recordTitleColumnOptions,
  isDisableSaveButton,
  isSaving,
  onSave,
}: Props) => {
  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <NoticeableLetters>Display config</NoticeableLetters>
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          <DialogBody>
            {error ? (
              <ErrorMessage {...error} />
            ) : isFetchComplete ? (
              <>
                <DialogMain>
                  <DialogSubTitle>Record table columns</DialogSubTitle>
                  <OptionSharingSelects
                    onChange={onChangeDisplayColumns}
                    options={displayColumnsOptions}
                    values={displayColumns}
                    creatable
                    deletable
                  />
                  <DialogSubTitle>Record title</DialogSubTitle>
                  <SoloSelect
                    options={recordTitleColumnOptions}
                    onChange={onChangeRecordTitleColumn}
                    value={recordTitleColumn}
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
              </>
            ) : null}
          </DialogBody>
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
  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const [recordTitleColumn, setRecordTitleColumn] = useState("");
  const [columnOptions, setColumnOptions] = useState<OptionType[]>([]);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

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

  const fetchError = getConfigError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: JSON.stringify(fetchError),
        instruction: "Please reload this page",
      });
    }
  }, [fetchError]);

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

  useEffect(() => {
    if (getConfigRes) {
      setDisplayColumns(
        getConfigRes.columns
          .filter((column) => column.is_display_field)
          .map((column) => column.name) || []
      );
      setRecordTitleColumn(
        getConfigRes.columns.find((column) => column.is_record_title)?.name ||
          ""
      );
      setColumnOptions(
        getConfigRes.columns
          .map((column) => ({
            label: `${column.name} (display name: ${column.display_name})`,
            value: column.name,
          }))
          .sort(compareOption)
      );
    }
  }, [getConfigRes]);

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

        draft.columns = draft.columns.map((column) => ({
          ...column,
          is_record_title: column.name === recordTitleColumn,
        }));
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
        setError({
          reason: JSON.stringify(fetchError),
          instruction: "Please reload this page",
        });
      } else {
        mutate(getConfigCacheKey, updateConfigRes);
      }

      setIsSaving(false);
    }
    onClose();
  };

  const isFetchComplete = Boolean(!fetchError && getConfigRes);
  const isDisableSaveButton =
    displayColumns.length <= 0 || displayColumns.includes("");

  return (
    <Component
      databaseId={databaseId}
      displayColumns={displayColumns}
      displayColumnsOptions={columnOptions}
      error={error}
      isDisableSaveButton={isDisableSaveButton}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      onChangeDisplayColumns={setDisplayColumns}
      onChangeRecordTitleColumn={setRecordTitleColumn}
      onClose={onClose}
      onSave={onSave}
      open={open}
      recordTitleColumn={recordTitleColumn}
      recordTitleColumnOptions={columnOptions}
    />
  );
};

export { Container as DisplayConfigEditModal };
export type { ContainerProps as DisplayConfigEditModalProps, ConfigNameType };
