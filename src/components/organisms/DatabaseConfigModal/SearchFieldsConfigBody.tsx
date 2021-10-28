import {
  DialogMain,
  ErrorMessageProps,
  ErrorMessage,
} from "@dataware-tools/app-common";
import { produce } from "immer";
import { useState, useLayoutEffect } from "react";

import { useRecoilState } from "recoil";
import { databaseConfigState } from "./DatabaseConfigState";
import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "components/organisms/OptionSharingSelects";

export type SearchFieldsConfigBodyPresentationProps = {
  error?: ErrorMessageProps;
  onChangeSearchTargetColumns: OptionSharingSelectsProps["onChange"];
  searchTargetColumnsOptions: OptionSharingSelectsProps["options"];
  searchTargetColumns: OptionSharingSelectsProps["values"];
};

export const SearchFieldsConfigBodyPresentation = ({
  error,
  onChangeSearchTargetColumns,
  searchTargetColumnsOptions,
  searchTargetColumns,
}: SearchFieldsConfigBodyPresentationProps): JSX.Element => {
  return error ? (
    <ErrorMessage {...error} />
  ) : (
    <DialogMain>
      <OptionSharingSelects
        onChange={onChangeSearchTargetColumns}
        options={searchTargetColumnsOptions}
        values={searchTargetColumns}
        creatable
        deletable
      />
    </DialogMain>
  );
};

export const SearchFieldsConfigBody = (): JSX.Element => {
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [databaseConfig, setDatabaseConfig] = useRecoilState(
    databaseConfigState
  );
  const [
    numOfSearchTargetColumns,
    setNumOfSearchTargetColumns,
  ] = useState<number>(
    databaseConfig?.columns.filter((column) => column.is_search_target)
      .length || 0
  );

  useLayoutEffect(() => {
    if (databaseConfig && databaseConfig.columns.length <= 0) {
      setError({
        reason: "No available column",
        instruction: "Please add data or input field",
      });
    } else {
      setError(undefined);
    }
  }, [databaseConfig]);

  if (typeof databaseConfig === "undefined") {
    console.error("database config should not be undefined!!");
    return <ErrorMessage reason="Invalid state" />;
  }

  const tempSearchTargetColumns =
    databaseConfig?.columns
      .filter((column) => column.is_search_target)
      .map((column) => column.name) || [];
  const searchTargetColumns =
    tempSearchTargetColumns.length < numOfSearchTargetColumns
      ? tempSearchTargetColumns.concat(
          new Array(
            numOfSearchTargetColumns - tempSearchTargetColumns.length
          ).fill("")
        )
      : tempSearchTargetColumns;

  const onChangeSearchTargetColumns: SearchFieldsConfigBodyPresentationProps["onChangeSearchTargetColumns"] = (
    newSearchTargetColumns
  ) => {
    setNumOfSearchTargetColumns(newSearchTargetColumns.length);
    if (databaseConfig) {
      // setIsSaving(true);
      const newDatabaseConfig = produce(databaseConfig, (draft) => {
        draft.columns = draft.columns.map((column) => ({
          ...column,
          is_search_target: newSearchTargetColumns.includes(column.name),
        }));
      });
      setDatabaseConfig(newDatabaseConfig);
    }
  };

  const searchTargetColumnsOptions =
    databaseConfig?.columns.map((column) => ({
      label: `${column.name} (display name: ${column.display_name})`,
      value: column.name,
    })) || [];

  return (
    <SearchFieldsConfigBodyPresentation
      onChangeSearchTargetColumns={onChangeSearchTargetColumns}
      searchTargetColumns={searchTargetColumns}
      searchTargetColumnsOptions={searchTargetColumnsOptions}
      error={error}
    />
  );
};
