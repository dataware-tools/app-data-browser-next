import {
  ErrorMessage,
  DialogMain,
  ErrorMessageProps,
} from "@dataware-tools/app-common";
import { produce } from "immer";
import { useState, useLayoutEffect } from "react";

import { useRecoilState } from "recoil";
import { databaseConfigState } from "./DatabaseConfigState";
import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "components/organisms/OptionSharingSelects";

export type SecretFieldsConfigBodyPresentationProps = {
  error?: ErrorMessageProps;
  onChangeSecretColumns: OptionSharingSelectsProps["onChange"];
  secretColumnsOptions: OptionSharingSelectsProps["options"];
  secretColumns: OptionSharingSelectsProps["values"];
};

export const SecretFieldsConfigBodyPresentation = ({
  error,
  onChangeSecretColumns,
  secretColumnsOptions,
  secretColumns,
}: SecretFieldsConfigBodyPresentationProps): JSX.Element => {
  return error ? (
    <ErrorMessage {...error} />
  ) : (
    <DialogMain>
      <OptionSharingSelects
        onChange={onChangeSecretColumns}
        options={secretColumnsOptions}
        values={secretColumns}
        creatable
        deletable
      />
    </DialogMain>
  );
};

export const SecretFieldsConfigBody = (): JSX.Element => {
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [databaseConfig, setDatabaseConfig] = useRecoilState(
    databaseConfigState
  );
  const [numOfSecretColumns, setNumOfSecretColumns] = useState<number>(
    databaseConfig?.columns?.filter((column) => column.is_secret).length || 0
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

  const tempSecretColumns =
    databaseConfig?.columns
      ?.filter((column) => column.is_secret)
      ?.map((column) => column.name) || [];
  const secretColumns =
    tempSecretColumns.length < numOfSecretColumns
      ? tempSecretColumns.concat(
          new Array(numOfSecretColumns - tempSecretColumns.length).fill("")
        )
      : tempSecretColumns;

  const onChangeSecretColumns: SecretFieldsConfigBodyPresentationProps["onChangeSecretColumns"] = (
    newSecretColumns
  ) => {
    setNumOfSecretColumns(newSecretColumns.length);
    if (databaseConfig?.columns) {
      const newDatabaseConfig = produce(databaseConfig, (draft) => {
        draft.columns = draft.columns.map((column) => ({
          ...column,
          is_secret: newSecretColumns.includes(column.name),
        }));
      });

      setDatabaseConfig(newDatabaseConfig);
    }
  };

  const secretColumnsOptions =
    databaseConfig?.columns.map((column) => ({
      label: `${column.name} (display name: ${column.display_name})`,
      value: column.name,
    })) || [];

  return (
    <SecretFieldsConfigBodyPresentation
      onChangeSecretColumns={onChangeSecretColumns}
      secretColumns={secretColumns}
      secretColumnsOptions={secretColumnsOptions}
      error={error}
    />
  );
};
