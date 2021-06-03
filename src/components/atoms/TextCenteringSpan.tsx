import { makeStyles } from "@material-ui/core/styles";

type Props = { children: string };

const useStyles = makeStyles(() => ({
  span: {
    paddingTop: "0.1em",
  },
}));

const Component = ({ children }: Props): JSX.Element => {
  const classes = useStyles();
  return <span className={classes.span}>{children}</span>;
};

export { Component as TextCenteringSpan };
export type { Props as TextCenteringSpanProps };
