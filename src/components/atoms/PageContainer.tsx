import { makeStyles } from "@material-ui/core/styles";
import { ReactNode } from "react";

type Props = { children: ReactNode };

const useStyles = makeStyles(() => ({
  div: {
    display: "flex",
    flexDirection: "column",
    height: "75vh",
    padding: "0 10vw",
  },
}));

const Component = ({ children }: Props): JSX.Element => {
  const classes = useStyles();
  return <div className={classes.div}>{children}</div>;
};

export { Component as PageContainer };
export type { Props as PageContainerProps };
