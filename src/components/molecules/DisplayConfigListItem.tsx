import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import React from "react";

type ActionType = "change" | "delete";

type Props = {
  classes: ReturnType<typeof useStyles>;
} & ContainerProps;

type ContainerProps = {
  value: string;
  onChange: (action: ActionType, newValue: string, oldValue: string) => void;
  options: { label: string; value: string }[];
  alreadySelectedOptions: string[];
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const Component = ({
  classes,
  value,
  onChange,
  options,
  alreadySelectedOptions,
}: Props): JSX.Element => {
  console.log(value);
  return (
    <div className={classes.root}>
      <Select
        value={value}
        onChange={(event) =>
          onChange("change", event.target.value as string, value)
        }
        variant="outlined"
      >
        <MenuItem value={value}>
          {options.find((option) => option.value === value)?.label || value}
        </MenuItem>
        {options.map((option, index) =>
          alreadySelectedOptions.includes(option.value) ? null : (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          )
        )}
      </Select>
      <ElemCenteringFlexDiv>
        <IconButton onClick={() => onChange("delete", "", value)}>
          <DeleteIcon />
        </IconButton>
      </ElemCenteringFlexDiv>
    </div>
  );
};

const Container = React.memo(
  ({ ...delegated }: ContainerProps): JSX.Element => {
    const classes = useStyles();
    return <Component classes={classes} {...delegated} />;
  }
);

export { Container as DisplayConfigListItem };
export type { ContainerProps as DisplayConfigListItemProps, ActionType };
