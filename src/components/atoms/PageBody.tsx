import { makeStyles } from "@material-ui/core/styles";
import { ReactNode } from "react";

type Props = { children: ReactNode };

const useStyles = makeStyles(() => ({
  div: {
    flex: 1,
    overflow: "auto",
    paddingRight: "10px",
  },
}));

const Component = ({ children }: Props): JSX.Element => {
  const classes = useStyles();
  return <div className={classes.div}>{children}</div>;
};

export { Component as PageBody };
export type { Props as PageBodyProps };
