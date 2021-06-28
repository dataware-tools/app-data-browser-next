import Select, { SelectProps } from "@material-ui/core/Select";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import React from "react";

type ActionType = "update" | "delete";
type OptionsType = { label: string; value: string }[];

type Props = {
  classes: ReturnType<typeof useStyles>;
} & ContainerProps;

type ContainerProps = {
  value: string;
  index: number;
  onChange: (
    action: ActionType,
    index: number,
    newValue: string,
    oldValue: string
  ) => void;
  deletable?: boolean;
  options: OptionsType;
  restOptions: OptionsType;
  selectProps?: Omit<SelectProps, "value" | "onChange">;
  menuItemProps?: Omit<MenuItemProps, "value">;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputSelect: {
    minWidth: 400,
  },
});

const Component = ({
  classes,
  value,
  index,
  onChange,
  options,
  restOptions,
  selectProps,
  deletable,
  menuItemProps,
}: Props): JSX.Element => {
  return (
    <div className={classes.root}>
      <Select
        variant="outlined"
        {...selectProps}
        value={value}
        onChange={(event) =>
          onChange("update", index, event.target.value as string, value)
        }
        className={classes.inputSelect}
      >
        <MenuItem {...menuItemProps} value={value}>
          {options.find((option) => option.value === value)?.label || value}
        </MenuItem>
        {restOptions.map((option, index) => (
          <MenuItem key={index} {...menuItemProps} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {deletable ? (
        <ElemCenteringFlexDiv>
          <IconButton onClick={() => onChange("delete", index, "", value)}>
            <DeleteIcon />
          </IconButton>
        </ElemCenteringFlexDiv>
      ) : null}
    </div>
  );
};

const Container = React.memo(
  ({ ...delegated }: ContainerProps): JSX.Element => {
    const classes = useStyles();
    return <Component classes={classes} {...delegated} />;
  }
);

export { Container as OptionSharingSelectsItem };
export type { ContainerProps as OptionSharingSelectsItemProps, ActionType };
