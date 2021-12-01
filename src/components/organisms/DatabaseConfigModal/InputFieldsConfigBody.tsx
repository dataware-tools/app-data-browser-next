import { DialogMain, ErrorMessage } from "@dataware-tools/app-common";
import { produce } from "immer";
import { useRecoilState } from "recoil";
import { databaseConfigState } from "./DatabaseConfigState";
import {
  InputConfigList,
  InputConfigListProps,
} from "components/organisms/InputConfigList";
import { isEditableColumnName } from "utils";

export type InputFieldsConfigBodyPresentationProps = {
  inputColumns: InputConfigListProps["value"];
  nonInputColumns: InputConfigListProps["restColumns"];
  onChangeInputColumns: InputConfigListProps["onChange"];
};

export const InputFieldsConfigBodyPresentation = ({
  inputColumns,
  nonInputColumns,
  onChangeInputColumns,
}: InputFieldsConfigBodyPresentationProps): JSX.Element => {
  return (
    <DialogMain>
      <InputConfigList
        value={inputColumns}
        onChange={onChangeInputColumns}
        restColumns={nonInputColumns}
      />
    </DialogMain>
  );
};

export const InputFieldsConfigBody = (): JSX.Element => {
  const [databaseConfig, setDatabaseConfig] =
    useRecoilState(databaseConfigState);

  if (typeof databaseConfig === "undefined") {
    console.error("database config should not be undefined!!");
    return <ErrorMessage reason="Invalid state" />;
  }

  const inputColumns =
    databaseConfig?.columns.map((column) => ({
      ...column,
      necessity: column.necessity || "unnecessary",
      is_secret: column.is_secret || false,
    })) || [];

  const onChangeInputColumns: InputFieldsConfigBodyPresentationProps["onChangeInputColumns"] =
    (newInputColumns) => {
      if (databaseConfig) {
        const newDatabaseConfig = produce(databaseConfig, (draft) => {
          // update existing columns
          draft.columns = databaseConfig.columns.map((oldColumn) => {
            const newColumn = newInputColumns.find(
              (column) => column.name === oldColumn.name
            );
            return { ...oldColumn, ...newColumn };
          });
          // add new columns
          const addedColumns = newInputColumns.filter((column) => {
            const existingNames = databaseConfig.columns.map(
              (column) => column.name
            );
            return !existingNames.includes(column.name);
          });
          draft.columns = draft.columns.concat(addedColumns);
        });
        setDatabaseConfig(newDatabaseConfig);
      }
    };

  const nonInputColumns = (databaseConfig?.columns
    .filter(
      (column) =>
        isEditableColumnName(databaseConfig, column.name) &&
        (column.necessity == null || column.necessity === "unnecessary")
    )
    ?.map((column) => ({
      display_name: column.display_name,
      name: column.name,
    })) || []) as {
    name: string;
    display_name: string;
  }[];

  return (
    <InputFieldsConfigBodyPresentation
      inputColumns={inputColumns}
      nonInputColumns={nonInputColumns}
      onChangeInputColumns={onChangeInputColumns}
    />
  );
};
