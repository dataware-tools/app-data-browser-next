import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import {
  DisplayConfigListItem,
  DisplayConfigListItemProps,
} from "components/molecules/DisplayConfigListItem";

type ComponentProps = {
  classes: ReturnType<typeof useStyles>;
} & ContainerProps;

type ContainerProps = {
  value: DisplayConfigListItemProps["value"][];
  onChange: (
    action: "change" | "delete",
    index: number,
    newConfig: string,
    oldConfig: string
  ) => void;
  usedOptions: DisplayConfigListItemProps["usedOptions"];
  options: DisplayConfigListItemProps["options"];
};

const Component = ({
  classes,
  value,
  onChange,
  ...delegated
}: ComponentProps): JSX.Element => {
  return (
    <>
      <div className={classes.root}>
        {value.map((config, index) => {
          return (
            <div key={index}>
              <DisplayConfigListItem
                value={config}
                onChange={(action, newValue, oldValue) => {
                  onChange(action, index, newValue, oldValue);
                }}
                {...delegated}
              />
              <Spacer direction="vertical" size="3vh" />
            </div>
          );
        })}
      </div>
    </>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
});

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const classes = useStyles();
  return <Component {...delegated} classes={classes} />;
};

export { Container as DisplayConfigList };
export type { ContainerProps as DisplayConfigListProps };
