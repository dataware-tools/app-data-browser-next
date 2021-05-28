import { makeStyles } from "@material-ui/core/styles";
import { ReactNode } from "react";

type Props = { children: ReactNode };

const useStyles = makeStyles(() => ({
  div: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    padding: "10px",
  },
}));

const Component = ({ children }: Props): JSX.Element => {
  const classes = useStyles();
  return <div className={classes.div}>{children}</div>;
};

export { Component as DialogContainer };
export type { Props as DialogContainerProps };
