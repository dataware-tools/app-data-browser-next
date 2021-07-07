import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import { AddListItemButton } from "components/atoms/AddListItemButton";
import {
  InputConfigListItem,
  InputConfigListItemProps,
  ActionType,
} from "components/molecules/InputConfigListItem";
import { useState } from "react";
import { compInputFields } from "utils";
import { produce } from "immer";
import {
  InputConfigAddModal,
  InputConfigAddModalProps,
} from "components/organisms/InputConfigAddModal";

type ValueType = InputConfigListItemProps["value"][];
type Props = {
  classes: ReturnType<typeof useStyles>;
  onUpdate: InputConfigListItemProps["onUpdate"];
  onDelete: InputConfigListItemProps["onDelete"];
  onAdd: InputConfigAddModalProps["onSave"];
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  openAddModal: boolean;
  alreadyUsedColumnNames: InputConfigAddModalProps["alreadyUsedNames"];
  alreadyUsedColumnDisplayNames: InputConfigAddModalProps["alreadyUsedDisplayNames"];
} & Omit<ContainerProps, "onChange">;

type ContainerProps = {
  value: ValueType;
  restColumns: InputConfigAddModalProps["options"];
  onChange: (newValue: ValueType) => void;
};

const Component = ({
  value,
  classes,
  onUpdate,
  onDelete,
  onOpenAddModal,
  restColumns,
  openAddModal,
  onCloseAddModal,
  onAdd,
  alreadyUsedColumnDisplayNames,
  alreadyUsedColumnNames,
}: Props): JSX.Element => {
  return (
    <div className={classes.root}>
      {value.map((config, index) => {
        return (
          <div key={index}>
            <InputConfigListItem
              value={config}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
            <Spacer direction="vertical" size="3vh" />
          </div>
        );
      })}
      <AddListItemButton onClick={onOpenAddModal} />
      {restColumns ? (
        <InputConfigAddModal
          options={restColumns}
          open={openAddModal}
          onClose={onCloseAddModal}
          onSave={onAdd}
          alreadyUsedNames={alreadyUsedColumnNames}
          alreadyUsedDisplayNames={alreadyUsedColumnDisplayNames}
        />
      ) : null}
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
});

const Container = ({
  value,
  onChange,
  restColumns: initRestColumns,
}: ContainerProps): JSX.Element => {
  const classes = useStyles();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [restColumns, setRestColumns] = useState<Props["restColumns"]>(
    initRestColumns
  );

  const onAdd: Props["onAdd"] = (newColumn) => {
    onChange(
      value.some((prevColumn) => prevColumn.name === newColumn.name)
        ? value.map((prevColumn) =>
            prevColumn.name === newColumn.name
              ? { ...prevColumn, ...newColumn }
              : prevColumn
          )
        : [...value, newColumn]
    );
    setRestColumns((prev) => {
      if (prev) {
        const newOptions = produce(prev, (prev) => {
          prev.splice(
            prev.findIndex((elem) => elem.name === newColumn.name),
            1
          );
        });
        return newOptions;
      } else {
        return prev;
      }
    });
  };

  const onDelete: Props["onDelete"] = (oldValue) => {
    onChange(
      value.map((column) =>
        column.name === oldValue.name
          ? { ...column, necessity: "unnecessary" }
          : column
      )
    );
    setRestColumns((prev) => {
      if (prev) {
        const newOptions = produce(prev, (prev) => {
          prev.push({
            name: oldValue.name,
            display_name: oldValue.display_name,
          });
        });
        return newOptions;
      } else {
        return [{ name: oldValue.name, display_name: oldValue.display_name }];
      }
    });
  };

  const onUpdate: Props["onUpdate"] = (newValue, oldValue) => {
    onChange(
      value.map((column) =>
        column.name === oldValue.name ? { ...column, ...newValue } : column
      )
    );
  };

  const inputConfig = value
    .filter((column) => column.necessity && column.necessity !== "unnecessary")
    .sort(compInputFields);

  const alreadyUsedColumnDisplayNames = [
    ...new Set(value.map((column) => column.display_name)),
  ];

  const alreadyUsedColumnNames = [
    ...new Set(inputConfig.map((column) => column.name)),
  ];
  return (
    <Component
      classes={classes}
      alreadyUsedColumnNames={alreadyUsedColumnNames}
      alreadyUsedColumnDisplayNames={alreadyUsedColumnDisplayNames}
      onAdd={onAdd}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onCloseAddModal={() => setOpenAddModal(false)}
      onOpenAddModal={() => setOpenAddModal(true)}
      openAddModal={openAddModal}
      restColumns={restColumns}
      value={inputConfig}
    />
  );
};

export { Container as InputConfigList };
export type { ContainerProps as InputConfigListProps, ActionType, ValueType };
