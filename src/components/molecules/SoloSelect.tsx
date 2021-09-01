import { Spacer } from "@dataware-tools/app-common";
import Box from "@material-ui/core/Box";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import Select, { SelectProps } from "@material-ui/core/Select";
import React from "react";

type OptionsType = { label: string; value: string }[];
export type SoloSelectPresentationProps = SoloSelectProps;

export type SoloSelectProps = {
  label?: string;
  value?: string;
  onChange: (newValue: string) => void;
  options: OptionsType;
  selectProps?: Omit<SelectProps, "value" | "onChange">;
  menuItemProps?: Omit<MenuItemProps, "value">;
};

export const SoloSelectPresentation = ({
  value,
  onChange,
  options,
  selectProps,
  menuItemProps,
  label,
}: SoloSelectPresentationProps): JSX.Element => {
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

export const SoloSelect = React.memo(
  ({ ...delegated }: SoloSelectProps): JSX.Element => {
    return <SoloSelectPresentation {...delegated} />;
  }
);
