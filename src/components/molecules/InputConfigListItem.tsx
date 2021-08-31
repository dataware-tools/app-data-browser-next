import { Spacer } from "@dataware-tools/app-common";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { ReactNode } from "react";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { DatabaseColumnsConfigType } from "utils";

export type ValueType = Required<
  Pick<DatabaseColumnsConfigType[number], "display_name" | "name" | "necessity">
>;

export type ActionType = "change" | "delete";

export type InputConfigListItemPresentationProps = InputConfigListItemProps;
export type InputConfigListItemProps = {
  value: ValueType;
  label: ReactNode;
  onUpdate: (newValue: ValueType, oldValue: ValueType) => void;
  onDelete: (deletedValue: ValueType) => void;
};

export const InputConfigListItemPresentation = ({
  value,
  label,
  onUpdate,
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
        <Spacer direction="horizontal" size="10px" />
        <Select
          value={value.necessity}
          onChange={(event) =>
            onUpdate(
              {
                ...value,
                // @ts-expect-error event.target.value have incorrect type
                necessity: event.target.value,
              },
              { ...value }
            )
          }
          variant="outlined"
          sx={{ minWidth: "160px" }}
        >
          <MenuItem value="required">Required</MenuItem>
          <MenuItem value="recommended">Recommended</MenuItem>
          <MenuItem value="optional">Optional</MenuItem>
        </Select>
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
