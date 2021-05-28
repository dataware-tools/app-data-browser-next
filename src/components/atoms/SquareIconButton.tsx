import { makeStyles } from "@material-ui/core/styles";
import { theme as themeInstance } from "@dataware-tools/app-common";
import { MouseEventHandler, ReactNode } from "react";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  button: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    height: "40px",
    justifyContent: "center",
    width: "40px",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

type ContainerProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
  icon: ReactNode;
};

const Container = ({ icon, ...delegated }: ContainerProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.button} {...delegated}>
      {icon}
    </div>
  );
};

export { Container as SquareIconButton };
export type { ContainerProps as SquareIconButtonProps };
