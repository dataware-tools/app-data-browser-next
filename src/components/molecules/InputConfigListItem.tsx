import { Spacer } from "@dataware-tools/app-common";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React, { ReactNode } from "react";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { DatabaseColumnsConfigType } from "utils";

export type ValueType = Required<
  Pick<
    DatabaseColumnsConfigType[number],
    "display_name" | "name" | "necessity" | "is_secret"
  >
>;

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
        }}
      >
        <IconButton onClick={() => onConfigure()}>
          <SettingsIcon />
        </IconButton>
        <Spacer direction="horizontal" size="10px" />
        <ElemCenteringFlexDiv>
          <IconButton onClick={() => onDelete(value)}>
            <DeleteIcon />
          </IconButton>
        </ElemCenteringFlexDiv>
      </Box>
    </Box>
  );
};

export const InputConfigListItem = React.memo(
  ({ ...delegated }: InputConfigListItemProps): JSX.Element => {
    return <InputConfigListItemPresentation {...delegated} />;
  }
);
