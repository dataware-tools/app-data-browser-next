import { makeStyles } from "@material-ui/core/styles";
import { ReactNode } from "react";

const useStyles = makeStyles({
  title: {
    alignItems: "center",
    display: "flex",
    fontSize: "1.5rem",
    fontWeight: "initial",
  },
});

type ContainerProps = { children: ReactNode };

const Container = ({ children }: ContainerProps): JSX.Element => {
  const classes = useStyles();
  return <h1 className={classes.title}>{children}</h1>;
};

export { Container as DialogTitle };
export type { ContainerProps as DialogTitleProps };
