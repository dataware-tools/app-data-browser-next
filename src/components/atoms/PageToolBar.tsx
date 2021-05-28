import { makeStyles } from "@material-ui/core/styles";
import { ToolBar, ToolBarProps } from "@dataware-tools/app-common";

type Props = ToolBarProps;

const useStyles = makeStyles(() => ({
  div: {
    margin: "3vh 0",
    overflow: "auto",
    padding: "3px 0",
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

export { Component as PageToolBar };
export type { Props as PageToolBarProps };
