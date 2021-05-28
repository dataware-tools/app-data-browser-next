import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputConfigListItem,
  InputConfigListItemProps,
} from "components/molecules/InputConfigListItem";

type ComponentProps = {
  classes: ReturnType<typeof useStyles>;
} & ContainerProps;

type ContainerProps = {
  value: InputConfigListItemProps["value"][];
  onChange: (newConfigList: InputConfigListItemProps["value"][]) => void;
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
                  switch (action) {
                    case "change":
                      onChange(
                        value.map((oldConfig, i) =>
                          i === index ? newConfig : oldConfig
                        )
                      );
                      break;

                    case "delete":
                      onChange(value.filter((_, i) => i !== index));
                      break;

                    default:
                      break;
                  }
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
export type { ContainerProps as InputConfigListProps };
