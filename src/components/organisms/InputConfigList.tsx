import { Spacer } from "@dataware-tools/app-common";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Box from "@mui/material/Box";
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

export type ValueType = (InputConfigListItemProps["value"] & {
  order_of_input: DatabaseColumnsConfigType[number]["order_of_input"];
})[];

export type InputConfigListPresentationProps = {
  onUpdate: InputConfigListItemProps["onUpdate"];
  onDelete: InputConfigListItemProps["onDelete"];
  onAdd: InputConfigAddModalProps["onSave"];
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  openAddModal: boolean;
  alreadyUsedColumnNames: InputConfigAddModalProps["alreadyUsedNames"];
  alreadyUsedColumnDisplayNames: InputConfigAddModalProps["alreadyUsedDisplayNames"];
  onDragEnd: DragDropContextProps["onDragEnd"];
} & Omit<InputConfigListProps, "onChange">;

export type InputConfigListProps = {
  value: ValueType;
  restColumns: InputConfigAddModalProps["options"];
  onChange: (newValue: ValueType) => void;
};

export const InputConfigListPresentation = ({
  value,
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
}: InputConfigListPresentationProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "40vh",
        minHeight: "0",
        overflow: "auto",
        padding: "10px 0",
      }}
    >
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
                            <Box
                              component="span"
                              sx={{
                                alignItems: "center",
                                display: "flex",
                                flexDirection: "row",
                              }}
                              {...provided.dragHandleProps}
                            >
                              <DragIndicatorIcon />
                              {config.name}
                              <br />
                              {`(display name: ${config.display_name})`}
                            </Box>
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
    </Box>
  );
};

export const InputConfigList = ({
  value,
  onChange,
  restColumns: initRestColumns,
}: InputConfigListProps): JSX.Element => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [restColumns, setRestColumns] = useState<
    InputConfigListPresentationProps["restColumns"]
  >(initRestColumns);

  const order =
    value
      .filter(
        (column) => column.necessity && column.necessity !== "unnecessary"
      )
      .sort(compInputFields)
      .map((column) => column.name) || [];

  const onAdd: InputConfigListPresentationProps["onAdd"] = (newColumn) => {
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

  const onDelete: InputConfigListPresentationProps["onDelete"] = (oldValue) => {
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

  const onUpdate: InputConfigListPresentationProps["onUpdate"] = (
    newValue,
    oldValue
  ) => {
    onChange(
      value.map((column) =>
        column.name === oldValue.name ? { ...column, ...newValue } : column
      )
    );
  };

  const onDragEnd: InputConfigListPresentationProps["onDragEnd"] = (result) => {
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
    <InputConfigListPresentation
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
