import { Spacer } from "@dataware-tools/app-common";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { makeStyles } from "@material-ui/styles";
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

type Props = {
  classes: ReturnType<typeof useStyles>;
  onChange: (
    action: ActionType | "create",
    index: number,
    newValue: string,
    oldValue: string
  ) => void;
  restOptions: OptionSharingSelectsItemProps["options"];
  onDragEnd: DragDropContextProps["onDragEnd"];
} & Omit<ContainerProps, "onChange" | "allowDuplicatedOption" | "sortOptions">;

type ContainerProps = {
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

const Component = ({
  classes,
  values,
  space,
  onChange,
  creatable,
  onDragEnd,
  draggable,
  ...delegated
}: Props): JSX.Element => {
  return (
    <div className={classes.root}>
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
                        <span className={classes.draggable}>
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
                        </span>
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
  options,
  onChange: propsOnChange,
  values,
  allowDuplicatedOption,
  sortOptions: propsSortOptions,
  ...delegated
}: ContainerProps): JSX.Element => {
  const classes = useStyles();
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

  const onChange: Props["onChange"] = (action, index, newValue, oldValue) => {
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

  const onDragEnd: Props["onDragEnd"] = (result) => {
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
    <Component
      options={options}
      onChange={onChange}
      values={values}
      restOptions={restOptions}
      onDragEnd={onDragEnd}
      {...delegated}
      classes={classes}
    />
  );
};

export { Container as OptionSharingSelects };
export type { ContainerProps as OptionSharingSelectsProps, OptionType };
