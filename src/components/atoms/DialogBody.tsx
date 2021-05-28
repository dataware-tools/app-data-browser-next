import { makeStyles } from "@material-ui/core/styles";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
};

const useStyles = makeStyles({
  div: {
    display: "flex",
    flex: 1,
    flexDirection: (props: Props) => props.flexDirection || "initial",
    overflow: "auto",
    padding: "0 2vw",
  },
});

const Component = ({ children, flexDirection }: Props): JSX.Element => {
  const classes = useStyles({ children, flexDirection });
  return <div className={classes.div}>{children}</div>;
};

export { Component as DialogBody };
export type { Props as DialogBodyProps };
