import { makeStyles } from "@material-ui/core/styles";
import { ToolBar, ToolBarProps } from "@dataware-tools/app-common";

type Props = ToolBarProps;

const useStyles = makeStyles(() => ({
  div: {
    margin: "2vh 1vw",
  },
}));

const Component = ({ ...delegated }: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.div}>
      <ToolBar {...delegated} />
    </div>
  );
};

export { Component as DialogToolBar };
export type { Props as DialogToolBarProps };
