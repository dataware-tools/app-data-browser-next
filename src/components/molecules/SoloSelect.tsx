import { Spacer } from "@dataware-tools/app-common";
import Box from "@material-ui/core/Box";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import Select, { SelectProps } from "@material-ui/core/Select";
import React from "react";

type OptionsType = { label: string; value: string }[];
type Props = ContainerProps;

type ContainerProps = {
  label?: string;
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
  label,
}: Props): JSX.Element => {
  return (
    <Box
      sx={{
        color: "text.secondary",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {label ? (
        <>
          <Box
            component="label"
            sx={{
              alignItems: "center",
              display: "flex",
              fontSize: "0.9rem",
              justifyContent: "center",
            }}
          >
            {label}
          </Box>
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
    </Box>
  );
};

const Container = React.memo(
  ({ ...delegated }: ContainerProps): JSX.Element => {
    return <Component {...delegated} />;
  }
);

export { Container as SoloSelect };
export type { ContainerProps as SoloSelectProps };
