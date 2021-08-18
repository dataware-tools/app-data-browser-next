import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { produce } from "immer";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DragDropContextProps,
} from "react-beautiful-dnd";
import { AddListItemButton } from "components/atoms/AddListItemButton";
import {
  InputConfigListItem,
  InputConfigListItemProps,
  ActionType,
} from "components/molecules/InputConfigListItem";
import {
  InputConfigAddModal,
  InputConfigAddModalProps,
} from "components/organisms/InputConfigAddModal";
import {
  DatabaseColumnsConfigType,
  compInputFields,
  pydtkSystemColumns,
} from "utils";

type ValueType = (InputConfigListItemProps["value"] & {
  order_of_input: DatabaseColumnsConfigType[number]["order_of_input"];
})[];
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
  onDragEnd: DragDropContextProps["onDragEnd"];
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
  onDragEnd,
}: Props): JSX.Element => {
  return (
    <div className={classes.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {value.map((config, index) => {
                return (
                  <Draggable key={index} draggableId={`${index}`} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <InputConfigListItem
                          label={
                            <span
                              className={classes.draggable}
                              {...provided.dragHandleProps}
                            >
                              <DragIndicatorIcon />
                              {config.name}
                              <br />
                              {`(display name: ${config.display_name})`}
                            </span>
                          }
                          value={config}
                          onUpdate={onUpdate}
                          onDelete={onDelete}
                        />
                        <Spacer direction="vertical" size="3vh" />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
    flexDirection: "column",
    maxHeight: "40vh",
    minHeight: "0",
    overflow: "auto",
    padding: "10px 0",
  },
  draggable: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
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

  const order =
    value
      .filter(
        (column) => column.necessity && column.necessity !== "unnecessary"
      )
      .sort(compInputFields)
      .map((column) => column.name) || [];

  const onAdd: Props["onAdd"] = (newColumn) => {
    onChange(
      value.some((prevColumn) => prevColumn.name === newColumn.name)
        ? value.map((prevColumn) =>
            prevColumn.name === newColumn.name
              ? {
                  ...prevColumn,
                  ...newColumn,
                  order_of_input: order.length,
                }
              : prevColumn
          )
        : [...value, { ...newColumn, order_of_input: order.length }]
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
          ? { ...column, necessity: "unnecessary", order_of_input: undefined }
          : {
              ...column,
              order_of_input:
                column.order_of_input != null &&
                column.order_of_input > order.indexOf(column.name)
                  ? column.order_of_input - 1
                  : column.order_of_input,
            }
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

  const onDragEnd: Props["onDragEnd"] = (result) => {
    if (result.destination) {
      const newOrder = produce(order, (draft) => {
        const [removed] = draft.splice(result.source.index, 1);
        // @ts-expect-error result.destination is not undefined
        draft.splice(result.destination.index, 0, removed);
      });

      const newValue = value.map((column) => {
        if (newOrder.includes(column.name)) {
          return { ...column, order_of_input: newOrder.indexOf(column.name) };
        } else {
          return { ...column, order_of_input: undefined };
        }
      });
      onChange(newValue);
    }
  };

  const inputConfig =
    value
      .filter((column) => order.includes(column.name))
      .sort(compInputFields) || [];

  const alreadyUsedColumnDisplayNames = [
    ...new Set(value.map((column) => column.display_name)),
  ];

  const alreadyUsedColumnNames = [
    ...new Set(
      inputConfig.map((column) => column.name).concat(pydtkSystemColumns)
    ),
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
      onDragEnd={onDragEnd}
    />
  );
};

export { Container as InputConfigList };
export type { ContainerProps as InputConfigListProps, ActionType, ValueType };
