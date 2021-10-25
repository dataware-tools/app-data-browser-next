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
  InputConfigListItemModal,
  InputConfigListItemModalProps,
} from "components/organisms/InputConfigListItemModal";
import {
  DatabaseColumnsConfigType,
  compInputFields,
  pydtkSystemColumns,
} from "utils";

export type ValueType = (InputConfigListItemProps["value"] & {
  order_of_input: DatabaseColumnsConfigType[number]["order_of_input"];
})[];

export type InputConfigListPresentationProps = {
  onConfigure: (index: number) => void;
  onDelete: InputConfigListItemProps["onDelete"];
  onAddOrUpdate: InputConfigListItemModalProps["onSave"];
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  onCloseConfigureModal: () => void;
  openAddModal: boolean;
  configureModalOpeningIndex: number;
  alreadyUsedColumnNames: InputConfigListItemModalProps["alreadyUsedNames"];
  alreadyUsedColumnDisplayNames: InputConfigListItemModalProps["alreadyUsedDisplayNames"];
  onDragEnd: DragDropContextProps["onDragEnd"];
} & Omit<InputConfigListProps, "onChange">;

export type InputConfigListProps = {
  value: ValueType;
  restColumns: InputConfigListItemModalProps["options"];
  onChange: (newValue: ValueType) => void;
};

export const InputConfigListPresentation = ({
  value,
  onDelete,
  onConfigure,
  onOpenAddModal,
  restColumns,
  openAddModal,
  configureModalOpeningIndex,
  onCloseAddModal,
  onCloseConfigureModal,
  onAddOrUpdate,
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
                          onDelete={onDelete}
                          onConfigure={() => {
                            onConfigure(index);
                          }}
                        />
                        <Spacer direction="vertical" size="3vh" />
                        <InputConfigListItemModal
                          options={restColumns}
                          open={configureModalOpeningIndex === index}
                          onClose={onCloseConfigureModal}
                          onSave={onAddOrUpdate}
                          alreadyUsedNames={alreadyUsedColumnNames.filter(
                            (value) => {
                              return value !== config.name;
                            }
                          )}
                          alreadyUsedDisplayNames={alreadyUsedColumnDisplayNames.filter(
                            (value) => {
                              return value !== config.display_name;
                            }
                          )}
                          initialData={config}
                        />
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
        <InputConfigListItemModal
          options={restColumns}
          open={openAddModal}
          onClose={onCloseAddModal}
          onSave={onAddOrUpdate}
          alreadyUsedNames={alreadyUsedColumnNames}
          alreadyUsedDisplayNames={alreadyUsedColumnDisplayNames}
          initialData={null}
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
  const [configureModalOpeningIndex, setConfigureModalOpeningIndex] = useState(
    -1
  );
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

  const onAddOrUpdate: InputConfigListPresentationProps["onAddOrUpdate"] = (
    newColumn
  ) => {
    onChange(
      value.some((prevColumn) => prevColumn.name === newColumn.name)
        ? value.map((prevColumn) =>
            prevColumn.name === newColumn.name
              ? {
                  ...prevColumn,
                  ...newColumn,
                }
              : prevColumn
          )
        : [...value, { ...newColumn, order_of_input: order.length }]
    );
    setRestColumns((prev) => {
      if (prev) {
        const splicedIndex = prev.findIndex(
          (elem) => elem.name === newColumn.name
        );
        if (splicedIndex >= 0) {
          const newOptions = produce(prev, (prev) => {
            prev.splice(splicedIndex, 1);
          });
          return newOptions;
        } else {
          return prev;
        }
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
    ...new Set(
      inputConfig
        .concat(value.filter((elem) => pydtkSystemColumns.includes(elem.name)))
        .map((column) => column.display_name)
    ),
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
      onAddOrUpdate={onAddOrUpdate}
      onDelete={onDelete}
      onConfigure={(index) => {
        setConfigureModalOpeningIndex(index);
      }}
      onCloseConfigureModal={() => setConfigureModalOpeningIndex(-1)}
      onCloseAddModal={() => setOpenAddModal(false)}
      onOpenAddModal={() => setOpenAddModal(true)}
      openAddModal={openAddModal}
      configureModalOpeningIndex={configureModalOpeningIndex}
      restColumns={restColumns}
      value={inputConfig}
      onDragEnd={onDragEnd}
    />
  );
};
