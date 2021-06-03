import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputConfigListItem,
  InputConfigListItemProps,
  ActionType,
  ValueType,
} from "components/molecules/InputConfigListItem";

type ComponentProps = {
  classes: ReturnType<typeof useStyles>;
} & ContainerProps;

type ContainerProps = {
  value: InputConfigListItemProps["value"][];
  onChange: (index: number, action: ActionType, newValue: ValueType) => void;
};

const Component = ({
  value,
  onChange,
  classes,
}: ComponentProps): JSX.Element => {
  return (
    <>
      <div className={classes.root}>
        {value.map((config, index) => {
          return (
            <div key={index}>
              <InputConfigListItem
                value={config}
                onChange={(action, newConfig) => {
                  onChange(index, action, newConfig);
                }}
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

export { Container as InputConfigList };
export type { ContainerProps as InputConfigListProps, ActionType, ValueType };
