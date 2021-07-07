import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import { useState, Fragment } from "react";
import {
  ActionType,
  OptionSharingSelectsItem,
  OptionSharingSelectsItemProps,
} from "components/molecules/OptionSharingSelectsItem";
import { produce } from "immer";
import { AddListItemButton } from "components/atoms/AddListItemButton";

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
} & Omit<ContainerProps, "onChange" | "allowDuplicatedOption" | "sortOptions">;

type ContainerProps = {
  values: ValuesType;
  onChange: (newValues: ValuesType) => void;
  options: OptionType[];
  sortOptions?: (option1: OptionType, option2: OptionType) => number;
  deletable?: boolean;
  creatable?: boolean;
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
  ...delegated
}: Props): JSX.Element => {
  return (
    <div className={classes.root}>
      {values.map((value, index) => {
        return (
          <Fragment key={index}>
            <OptionSharingSelectsItem
              value={value}
              index={index}
              onChange={onChange}
              {...delegated}
            />
            {index < values.length - 1 ? (
              <Spacer direction="vertical" size={space || "3vh"} />
            ) : null}
          </Fragment>
        );
      })}
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
    flex: 1,
    flexDirection: "column",
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

  return (
    <Component
      options={options}
      onChange={onChange}
      values={values}
      restOptions={restOptions}
      {...delegated}
      classes={classes}
    />
  );
};

export { Container as OptionSharingSelects };
export type { ContainerProps as OptionSharingSelectsProps, OptionType };
