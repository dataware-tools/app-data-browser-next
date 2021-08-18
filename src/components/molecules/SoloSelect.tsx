import { Spacer, theme as themeInstance } from "@dataware-tools/app-common";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import Select, { SelectProps } from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

type OptionsType = { label: string; value: string }[];
type Props = { classes: ReturnType<typeof useStyles> } & ContainerProps;

type ContainerProps = {
  label?: string;
  value?: string;
  onChange: (newValue: string) => void;
  options: OptionsType;
  selectProps?: Omit<SelectProps, "value" | "onChange">;
  menuItemProps?: Omit<MenuItemProps, "value">;
};

const Component = ({
  classes,
  value,
  onChange,
  options,
  selectProps,
  menuItemProps,
  label,
}: Props): JSX.Element => {
  return (
    <div className={classes.root}>
      {label ? (
        <>
          <label className={classes.label}>{label}</label>
          <Spacer direction="horizontal" size="8px" />
        </>
      ) : null}
      <Select
        variant="outlined"
        {...selectProps}
        value={value}
        onChange={(event) => onChange(event.target.value as string)}
      >
        {options.map((option, index) => (
          <MenuItem key={index} {...menuItemProps} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  root: {
    color: theme.palette.text.secondary,
    display: "flex",
    flexDirection: "row",
  },
  label: {
    alignItems: "center",
    display: "flex",
    fontSize: "0.9rem",
    justifyContent: "center",
  },
}));

const Container = React.memo(
  ({ ...delegated }: ContainerProps): JSX.Element => {
    const classes = useStyles();
    return <Component classes={classes} {...delegated} />;
  }
);

export { Container as SoloSelect };
export type { ContainerProps as SoloSelectProps };
