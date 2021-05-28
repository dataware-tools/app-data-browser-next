import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";

type Props = { classes: ReturnType<typeof useStyles> } & ContainerProps;

type ContainerProps = {
  value: string;
  onChange: (action: "change" | "delete", newValue: string) => void;
  options: string[];
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
}: Props): JSX.Element => {
  // TODO: use useMemo
  return (
    <div className={classes.root}>
      <Select
        value={value}
        onChange={(event) => onChange("change", event.target.value as string)}
        variant="outlined"
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <ElemCenteringFlexDiv>
        <IconButton onClick={() => onChange("delete", "")}>
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

export { Container as DisplayConfigListItem };
export type { ContainerProps as DisplayConfigListItemProps };
