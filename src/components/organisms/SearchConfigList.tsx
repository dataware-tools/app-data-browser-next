import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import {
  SearchConfigListItem,
  SearchConfigListItemProps,
  ActionType,
} from "components/molecules/SearchConfigListItem";

type ComponentProps = {
  classes: ReturnType<typeof useStyles>;
} & ContainerProps;

type ContainerProps = {
  value: SearchConfigListItemProps["value"][];
  onChange: (
    action: ActionType,
    index: number,
    newConfig: string,
    oldConfig: string
  ) => void;
  alreadySelectedOptions: SearchConfigListItemProps["alreadySelectedOptions"];
  options: SearchConfigListItemProps["options"];
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
              <SearchConfigListItem
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

export { Container as SearchConfigList };
export type { ContainerProps as SearchConfigListProps, ActionType };
