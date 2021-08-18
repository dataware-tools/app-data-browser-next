import { Spacer } from "@dataware-tools/app-common";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { ReactNode } from "react";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { DatabaseColumnsConfigType } from "utils";

type ValueType = Required<
  Pick<DatabaseColumnsConfigType[number], "display_name" | "name" | "necessity">
>;

type ActionType = "change" | "delete";

type Props = { classes: ReturnType<typeof useStyles> } & ContainerProps;
type ContainerProps = {
  value: ValueType;
  label: ReactNode;
  onUpdate: (newValue: ValueType, oldValue: ValueType) => void;
  onDelete: (deletedValue: ValueType) => void;
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
  inputSelect: {
    minWidth: 160,
  },
});

const Component = ({
  classes,
  value,
  label,
  onUpdate,
  onDelete,
}: Props): JSX.Element => {
  return (
    <div className={classes.root}>
      {label}
      <div className={classes.right}>
        <Spacer direction="horizontal" size="10px" />
        <Select
          value={value.necessity}
          onChange={(event) =>
            onUpdate(
              {
                ...value,
                necessity: event.target.value,
              },
              { ...value }
            )
          }
          variant="outlined"
          className={classes.inputSelect}
        >
          <MenuItem value="required">Required</MenuItem>
          <MenuItem value="recommended">Recommended</MenuItem>
          <MenuItem value="optional">Optional</MenuItem>
        </Select>
        <Spacer direction="horizontal" size="10px" />
        <ElemCenteringFlexDiv>
          <IconButton onClick={() => onDelete(value)}>
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
