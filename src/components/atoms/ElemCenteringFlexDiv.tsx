import { makeStyles } from "@material-ui/core/styles";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
};

const useStyles = makeStyles({
  div: {
    alignItems: "center",
    display: "flex",
    flexDirection: (props: Props) => props.flexDirection || "initial",
    justifyContent: "center",
  },
});

const Component = ({ children, flexDirection }: Props): JSX.Element => {
  const classes = useStyles({ children, flexDirection });
  return <div className={classes.div}>{children}</div>;
};

export { Component as ElemCenteringFlexDiv };
export type { Props as ElemCenteringFlexDivProps };
