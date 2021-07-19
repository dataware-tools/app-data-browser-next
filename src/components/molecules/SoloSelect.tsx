import Select, { SelectProps } from "@material-ui/core/Select";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import React from "react";

type OptionsType = { label: string; value: string }[];
type Props = ContainerProps;

type ContainerProps = {
  value?: string;
  onChange: (newValue: string) => void;
  options: OptionsType;
  selectProps?: Omit<SelectProps, "value" | "onChange">;
  menuItemProps?: Omit<MenuItemProps, "value">;
};

const Component = ({
  value,
  onChange,
  options,
  selectProps,
  menuItemProps,
}: Props): JSX.Element => {
  return (
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
  );
};

const Container = React.memo(
  ({ ...delegated }: ContainerProps): JSX.Element => {
    return <Component {...delegated} />;
  }
);

export { Container as SoloSelect };
export type { ContainerProps as SoloSelectProps };
