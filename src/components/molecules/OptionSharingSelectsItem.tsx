import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";
import React from "react";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";

export type ActionType = "update" | "delete";
type OptionsType = { label: string; value: string }[];

export type OptionSharingSelectsItemPresentationProps = OptionSharingSelectsItemProps;

export type OptionSharingSelectsItemProps = {
  value: string;
  index: number;
  onChange: (
    action: ActionType,
    index: number,
    newValue: string,
    oldValue: string
  ) => void;
  deletable?: boolean;
  options: OptionsType;
  restOptions: OptionsType;
  selectProps?: Omit<SelectProps, "value" | "onChange">;
  menuItemProps?: Omit<MenuItemProps, "value">;
};

export const OptionSharingSelectsItemPresentation = ({
  value,
  index,
  onChange,
  options,
  restOptions,
  selectProps,
  deletable,
  menuItemProps,
}: OptionSharingSelectsItemProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Select
        variant="outlined"
        {...selectProps}
        value={value}
        onChange={(event) =>
          onChange("update", index, event.target.value as string, value)
        }
        sx={{ minWidth: "400px", ...selectProps?.sx }}
      >
        <MenuItem {...menuItemProps} value={value}>
          {options.find((option) => option.value === value)?.label || value}
        </MenuItem>
        {restOptions.map((option, index) => (
          <MenuItem key={index} {...menuItemProps} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {deletable ? (
        <ElemCenteringFlexDiv>
          <IconButton onClick={() => onChange("delete", index, "", value)}>
            <DeleteIcon />
          </IconButton>
        </ElemCenteringFlexDiv>
      ) : null}
    </Box>
  );
};

export const OptionSharingSelectsItem = React.memo(
  ({ ...delegated }: OptionSharingSelectsItemProps): JSX.Element => {
    return <OptionSharingSelectsItemPresentation {...delegated} />;
  }
);
