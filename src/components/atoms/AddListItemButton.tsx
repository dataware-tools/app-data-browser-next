import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { theme as themeInstance } from "@dataware-tools/app-common";

type Props = {
  classes: ReturnType<typeof useStyles>;
} & ContainerProps;

type ContainerProps = {
  onClick: () => void;
};

const Component = ({ classes, onClick }: Props): JSX.Element => {
  return (
    <div onClick={onClick} className={classes.addButton}>
      <AddIcon />
    </div>
  );
};

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  addButton: {
    alignItems: "center",
    backgroundColor: theme.palette.grey[300],
    cursor: "pointer",
    display: "flex",
    height: "40px",
    justifyContent: "center",
    maxHeight: "40px",
    minHeight: "40px",
    "&:hover": {
      backgroundColor: theme.palette.grey[400],
    },
  },
}));

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const classes = useStyles();
  return <Component classes={classes} {...delegated} />;
};

export { Container as AddListItemButton };
export type { ContainerProps as AddListItemButtonProps };
