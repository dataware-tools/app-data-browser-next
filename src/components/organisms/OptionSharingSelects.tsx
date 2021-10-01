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
  ActionType,
  OptionSharingSelectsItem,
  OptionSharingSelectsItemProps,
} from "components/molecules/OptionSharingSelectsItem";

type ValuesType = OptionSharingSelectsItemProps["value"][];
type OptionType = OptionSharingSelectsItemProps["options"][number];

export type OptionSharingSelectsPresentationProps = {
  onChange: (
    action: ActionType | "create",
    index: number,
    newValue: string,
    oldValue: string
  ) => void;
  restOptions: OptionSharingSelectsItemProps["options"];
  onDragEnd: DragDropContextProps["onDragEnd"];
} & Omit<
  OptionSharingSelectsProps,
  "onChange" | "allowDuplicatedOption" | "sortOptions"
>;

export type OptionSharingSelectsProps = {
  values: ValuesType;
  onChange: (newValues: ValuesType) => void;
  options: OptionType[];
  sortOptions?: (option1: OptionType, option2: OptionType) => number;
  deletable?: boolean;
  creatable?: boolean;
  draggable?: boolean;
  selectProps?: OptionSharingSelectsItemProps["selectProps"];
  menuItemProps?: OptionSharingSelectsItemProps["menuItemProps"];
  space?: string;
  allowDuplicatedOption?: boolean;
};

export const OptionSharingSelectsPresentation = ({
  values,
  space,
  onChange,
  creatable,
  onDragEnd,
  draggable,
  ...delegated
}: OptionSharingSelectsPresentationProps): JSX.Element => {
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
        <Droppable droppableId="droppable" isDropDisabled={!draggable}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {values.map((value, index) => {
                return (
                  <Draggable
                    draggableId={`${index}`}
                    index={index}
                    isDragDisabled={!draggable}
                    key={index}
                  >
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Box
                          component="span"
                          sx={{
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          {draggable ? (
                            <span {...provided.dragHandleProps}>
                              <DragIndicatorIcon />
                            </span>
                          ) : null}
                          <OptionSharingSelectsItem
                            value={value}
                            index={index}
                            onChange={onChange}
                            {...delegated}
                          />
                        </Box>
                        {index < values.length - 1 ? (
                          <Spacer direction="vertical" size={space || "3vh"} />
                        ) : null}
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
      {creatable ? (
        <>
          <Spacer direction="vertical" size={space || "3vh"} />
          <AddListItemButton onClick={() => onChange("create", 0, "", "")} />
        </>
      ) : null}
    </Box>
  );
};

export const OptionSharingSelects = ({
  options,
  onChange: propsOnChange,
  values,
  allowDuplicatedOption,
  sortOptions: propsSortOptions,
  ...delegated
}: OptionSharingSelectsProps): JSX.Element => {
  const sortOptions =
    propsSortOptions ||
    ((a: OptionType, b: OptionType) => {
      if (a.label > b.label) {
        return 1;
      } else if (a.label < b.label) {
        return -1;
      } else {
        return 0;
      }
    });

  const [restOptions, setRestOptions] = useState(
    allowDuplicatedOption
      ? [...options].sort(sortOptions)
      : options
          .filter((option) => !values.includes(option.value))
          ?.sort(sortOptions)
  );

  const onChange: OptionSharingSelectsPresentationProps["onChange"] = (
    action,
    index,
    newValue,
    oldValue
  ) => {
    if (action === "update") {
      const newValues = produce(values, (draft) => {
        draft[index] = newValue;
      });
      propsOnChange(newValues);

      if (!allowDuplicatedOption) {
        setRestOptions((prev) => {
          const newRestOptions = prev.filter(
            (option) => option.value !== newValue
          );
          const addedOption = options.find(
            (option) => option.value === oldValue
          );
          if (addedOption) {
            newRestOptions.push(addedOption);
          }

          newRestOptions.sort(sortOptions);
          return newRestOptions;
        });
      }
    }

    if (action === "delete") {
      const newValues = produce(values, (draft) => {
        draft.splice(index, 1);
      });
      propsOnChange(newValues);

      if (!allowDuplicatedOption) {
        setRestOptions((prev) =>
          produce(prev, (draft) => {
            const addedOption = options.find(
              (option) => option.value === oldValue
            );
            if (addedOption) draft.push(addedOption);
            draft.sort(sortOptions);
          })
        );
      }
    }

    if (action === "create") {
      const newValues = produce(values, (draft) => {
        draft.push("");
      });
      propsOnChange(newValues);
    }
  };

  const onDragEnd: OptionSharingSelectsPresentationProps["onDragEnd"] = (
    result
  ) => {
    if (result.destination) {
      const newValues = produce(values, (draft) => {
        const [removed] = draft.splice(result.source.index, 1);
        // @ts-expect-error result.destination is not undefined
        draft.splice(result.destination.index, 0, removed);
      });
      propsOnChange(newValues);
    }
  };

  return (
    <OptionSharingSelectsPresentation
      options={options}
      onChange={onChange}
      values={values}
      restOptions={restOptions}
      onDragEnd={onDragEnd}
      {...delegated}
    />
  );
};
