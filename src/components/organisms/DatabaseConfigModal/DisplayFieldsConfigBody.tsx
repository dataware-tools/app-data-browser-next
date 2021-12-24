import {
  DialogMain,
  DialogSubTitle,
  ErrorMessage,
} from "@dataware-tools/app-common";
import { produce } from "immer";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { databaseConfigState } from "./DatabaseConfigState";
import { SoloSelect, SoloSelectProps } from "components/molecules/SoloSelect";

import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "components/organisms/OptionSharingSelects";
import { compStr } from "utils";

export type DisplayFieldsConfigBodyPresentationProps = {
  displayColumns: OptionSharingSelectsProps["values"];
  displayColumnsOptions: OptionSharingSelectsProps["options"];
  recordTitleColumn: SoloSelectProps["value"];
  recordTitleColumnOptions: SoloSelectProps["options"];
  onChangeDisplayColumns: OptionSharingSelectsProps["onChange"];
  onChangeRecordTitleColumn: SoloSelectProps["onChange"];
};

export const DisplayFieldsConfigBodyPresentation = ({
  displayColumnsOptions,
  displayColumns,
  recordTitleColumn,
  recordTitleColumnOptions,
  onChangeDisplayColumns,
  onChangeRecordTitleColumn,
}: DisplayFieldsConfigBodyPresentationProps): JSX.Element => {
  return (
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
  );
};

export const DisplayFieldsConfigBody = (): JSX.Element => {
  const [databaseConfig, setDatabaseConfig] =
    useRecoilState(databaseConfigState);
  const [numOfDisplayColumns, setNumOfDisplayColumns] = useState<number>(
    databaseConfig?.columns.filter((column) => column.is_display_field)
      .length || 0
  );

  if (typeof databaseConfig === "undefined") {
    console.error("database config should not be undefined!!");
    return <ErrorMessage reason="Invalid state" />;
  }

  const tempDisplayColumns =
    databaseConfig?.columns
      .filter((column) => column.is_display_field)
      .map((column) => column.name) || [];
  const displayColumns =
    tempDisplayColumns.length < numOfDisplayColumns
      ? tempDisplayColumns.concat(
          new Array(numOfDisplayColumns - tempDisplayColumns.length).fill("")
        )
      : tempDisplayColumns;

  const onChangeDisplayColumns: DisplayFieldsConfigBodyPresentationProps["onChangeDisplayColumns"] =
    (newDisplayColumns) => {
      setNumOfDisplayColumns(newDisplayColumns.length);
      if (databaseConfig) {
        const newDatabaseConfig = produce(databaseConfig, (draft) => {
          draft.columns = draft.columns.map((column) => ({
            ...column,
            is_display_field: newDisplayColumns.includes(column.name),
          }));

          draft.columns.sort((a, b) => {
            if (
              newDisplayColumns.includes(a.name) &&
              newDisplayColumns.includes(b.name)
            ) {
              return (
                newDisplayColumns.indexOf(a.name) -
                newDisplayColumns.indexOf(b.name)
              );
            } else if (newDisplayColumns.includes(a.name)) {
              return -1;
            } else if (newDisplayColumns.includes(b.name)) {
              return 1;
            } else {
              return compStr(a.name, b.name);
            }
          });
        });
        setDatabaseConfig(newDatabaseConfig);
      }
    };

  const recordTitleColumn =
    databaseConfig?.columns.find((column) => column.is_record_title)?.name ||
    "";
  const onChangeRecordTitleColumn: DisplayFieldsConfigBodyPresentationProps["onChangeRecordTitleColumn"] =
    (newTitleColumn) => {
      if (databaseConfig) {
        const newDatabaseConfig = produce(databaseConfig, (draft) => {
          draft.columns = draft.columns.map((column) => ({
            ...column,
            is_record_title: column.name === newTitleColumn,
          }));
        });
        setDatabaseConfig(newDatabaseConfig);
      }
    };

  const columnOptions =
    databaseConfig?.columns.map((column) => ({
      label: `${column.name} (display name: ${column.display_name})`,
      value: column.name,
    })) || [];

  return (
    <DisplayFieldsConfigBodyPresentation
      displayColumns={displayColumns}
      displayColumnsOptions={columnOptions}
      onChangeDisplayColumns={onChangeDisplayColumns}
      onChangeRecordTitleColumn={onChangeRecordTitleColumn}
      recordTitleColumn={recordTitleColumn}
      recordTitleColumnOptions={columnOptions}
    />
  );
};
