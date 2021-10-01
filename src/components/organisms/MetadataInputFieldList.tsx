import { Spacer } from "@dataware-tools/app-common";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { DatabaseColumnsConfigType } from "utils";

type MetadataType = Record<string, unknown>;

type FieldType = Pick<
  DatabaseColumnsConfigType[number],
  "display_name" | "name" | "necessity"
>;

export type MetadataInputFieldListProps = {
  currentMetadata?: MetadataType;
  fields: FieldType[];
  nonFilledRequiredFieldNames: string[];
  prefixInputElementId: string;
};

export const MetadataInputFieldList = ({
  currentMetadata,
  fields,
  nonFilledRequiredFieldNames,
  prefixInputElementId,
}: MetadataInputFieldListProps): JSX.Element => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {fields.map((field) => {
        const name = field.name;
        const displayName = field.display_name;
        const necessity = field.necessity;
        const required = necessity === "required";
        const recommended = necessity === "recommended";
        const id = `${prefixInputElementId}_${name.replace(/\s+/g, "")}`;
        return (
          <div key={name}>
            <Box
              component="label"
              htmlFor={id}
              sx={{
                fontSize: "1.5rem",
                fontWeight: required ? "bold" : undefined,
              }}
            >
              {displayName}
            </Box>
            <Box sx={{ padding: "0 3vw" }}>
              <TextField
                fullWidth
                key={field.name}
                id={id}
                defaultValue={currentMetadata?.[name]}
                error={nonFilledRequiredFieldNames.includes(name)}
                helperText={
                  required || recommended ? `This is ${necessity}` : undefined
                }
              />
            </Box>
            <Spacer direction="vertical" size="3vh" />
          </div>
        );
      })}
    </Box>
  );
};
