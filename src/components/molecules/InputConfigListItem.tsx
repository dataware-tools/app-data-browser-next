import { Spacer } from "@dataware-tools/app-common";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React, { ReactNode } from "react";
import { DatabaseColumnsConfigType } from "utils";

export type ValueType = DatabaseColumnsConfigType[number];

export type InputConfigListItemPresentationProps = InputConfigListItemProps;
export type InputConfigListItemProps = {
  value: ValueType;
  label: ReactNode;
  onConfigure: () => void;
  onDelete: (deletedValue: ValueType) => void;
};

export const InputConfigListItemPresentation = ({
  value,
  label,
  onConfigure,
  onDelete,
}: InputConfigListItemPresentationProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {label}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => onConfigure()}>
          <SettingsIcon />
        </IconButton>
        <Spacer direction="horizontal" size="10px" />
        <IconButton onClick={() => onDelete(value)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export const InputConfigListItem = React.memo(
  ({ ...delegated }: InputConfigListItemProps): JSX.Element => {
    return <InputConfigListItemPresentation {...delegated} />;
  }
);
