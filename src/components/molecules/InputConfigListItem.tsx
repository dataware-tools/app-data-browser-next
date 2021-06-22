import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Spacer } from "@dataware-tools/app-common";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import React from "react";
import { RecordAddInputableColumnsConfig } from "utils";

type ValueType = {
  display_name: string;
} & RecordAddInputableColumnsConfig[number];
type ActionType = "change" | "delete";

type Props = { classes: ReturnType<typeof useStyles> } & ContainerProps;
type ContainerProps = {
  value: ValueType;
  onChange: (action: ActionType, newValue: ValueType) => void;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: {
    display: "flex",
    flexDirection: "row",
  },
  right: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

const Component = ({ classes, value, onChange }: Props): JSX.Element => {
  return (
    <div className={classes.root}>
      <ElemCenteringFlexDiv>
        {value.name}
        <br />
        {`(display name: ${value.display_name})`}
      </ElemCenteringFlexDiv>
      <div className={classes.right}>
        <Spacer direction="horizontal" size="10px" />
        <Select
          value={value.necessity}
          onChange={(event) =>
            onChange("change", {
              ...value,
              necessity: event.target.value,
            })
          }
          variant="outlined"
        >
          <MenuItem value="required">Required</MenuItem>
          <MenuItem value="recommended">Recommended</MenuItem>
          <MenuItem value="optional">Optional</MenuItem>
        </Select>
        <Spacer direction="horizontal" size="10px" />
        <ElemCenteringFlexDiv>
          <IconButton onClick={() => onChange("delete", { ...value })}>
            <DeleteIcon />
          </IconButton>
        </ElemCenteringFlexDiv>
      </div>
    </div>
  );
};

const Container = React.memo(
  ({ ...delegated }: ContainerProps): JSX.Element => {
    const classes = useStyles();
    return <Component classes={classes} {...delegated} />;
  }
);

export { Container as InputConfigListItem };
export type {
  ContainerProps as InputConfigListItemProps,
  ValueType,
  ActionType,
};
