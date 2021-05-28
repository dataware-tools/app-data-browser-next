import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Spacer } from "@dataware-tools/app-common";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";

type InputConfig = { name: string; necessity: string };

type Props = { classes: ReturnType<typeof useStyles> } & ContainerProps;
type ContainerProps = {
  value: InputConfig;
  onChange: (action: "change" | "delete", newValue: InputConfig) => void;
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
});

const Component = ({ classes, value, onChange }: Props): JSX.Element => {
  // TODO: use useMemo
  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <TextField
          value={value.name}
          onChange={(event) =>
            onChange("change", { ...value, name: event.target.value })
          }
        />
        <Spacer direction="horizontal" size="10px" />
        <Select
          value={value.necessity}
          onChange={(event) =>
            onChange("change", {
              ...value,
              necessity: event.target.value as string,
            })
          }
          variant="outlined"
        >
          <MenuItem value="required">Required</MenuItem>
          <MenuItem value="recommended">Recommended</MenuItem>
          <MenuItem value="optional">Optional</MenuItem>
        </Select>
        <Spacer direction="horizontal" size="10px" />
      </div>
      <ElemCenteringFlexDiv>
        <IconButton onClick={() => onChange("delete", { ...value })}>
          <DeleteIcon />
        </IconButton>
      </ElemCenteringFlexDiv>
    </div>
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const classes = useStyles();
  return <Component classes={classes} {...delegated} />;
};

export { Container as InputConfigListItem };
export type { ContainerProps as InputConfigListItemProps, InputConfig };
