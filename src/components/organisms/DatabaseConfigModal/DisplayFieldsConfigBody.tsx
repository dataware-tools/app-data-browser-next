import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogBody,
  DialogMain,
  DialogToolBar,
  DialogSubTitle,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";
import { produce } from "immer";
import { useState, useEffect } from "react";
import { SoloSelect, SoloSelectProps } from "components/molecules/SoloSelect";

import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "components/organisms/OptionSharingSelects";
import { useGetConfig, fetchMetaStore, compStr } from "utils";

export type ConfigNameType = "record_list_display_columns";

export type DisplayFieldsConfigBodyPresentationProps = {
  error?: ErrorMessageProps;
  displayColumns: OptionSharingSelectsProps["values"];
  displayColumnsOptions: OptionSharingSelectsProps["options"];
  isFetchComplete: boolean;
  recordTitleColumn: SoloSelectProps["value"];
  recordTitleColumnOptions: SoloSelectProps["options"];
  isDisableSaveButton: LoadingButtonProps["disabled"];
  isSaving: LoadingButtonProps["loading"];
  onChangeDisplayColumns: OptionSharingSelectsProps["onChange"];
  onChangeRecordTitleColumn: SoloSelectProps["onChange"];
  onSave: LoadingButtonProps["onClick"];
} & Omit<DisplayFieldsConfigBodyProps, "databaseId">;

export type DisplayFieldsConfigBodyProps = {
  databaseId: string;
};

export const DisplayFieldsConfigBodyPresentation = ({
  error,
  displayColumnsOptions,
  displayColumns,
  isFetchComplete,
  recordTitleColumn,
  recordTitleColumnOptions,
  isDisableSaveButton,
  isSaving,
  onChangeDisplayColumns,
  onChangeRecordTitleColumn,
  onSave,
}: DisplayFieldsConfigBodyPresentationProps): JSX.Element => {
  return (
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
              draggable
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
                loading={isSaving}
                onClick={onSave}
              >
                Save
              </LoadingButton>
            }
          />
        </>
      ) : null}
    </DialogBody>
  );
};

export const DisplayFieldsConfigBody = ({
  databaseId,
}: DisplayFieldsConfigBodyProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const [recordTitleColumn, setRecordTitleColumn] = useState("");
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
    } else {
      setError(undefined);
    }
  }, [fetchError]);

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
        const { reason, instruction } = extractErrorMessageFromFetchError(
          updateConfigError
        );
        setError({ reason, instruction });
      } else {
        getConfigMutate(updateConfigRes);
      }

      setIsSaving(false);
    }
  };

  const columnOptions =
    getConfigRes?.columns.map((column) => ({
      label: `${column.name} (display name: ${column.display_name})`,
      value: column.name,
    })) || [];
  const isFetchComplete = Boolean(!fetchError && getConfigRes);
  const isDisableSaveButton =
    displayColumns.length <= 0 || displayColumns.includes("");

  return (
    <DisplayFieldsConfigBodyPresentation
      displayColumns={displayColumns}
      displayColumnsOptions={columnOptions}
      error={error}
      isDisableSaveButton={isDisableSaveButton}
      isFetchComplete={isFetchComplete}
      isSaving={isSaving}
      onChangeDisplayColumns={setDisplayColumns}
      onChangeRecordTitleColumn={setRecordTitleColumn}
      onSave={onSave}
      recordTitleColumn={recordTitleColumn}
      recordTitleColumnOptions={columnOptions}
    />
  );
};
