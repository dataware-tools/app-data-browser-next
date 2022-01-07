import { Spacer } from "@dataware-tools/app-common";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Control, Controller, ControllerProps } from "react-hook-form";
import { DatabaseColumnsConfigType } from "utils";

type FieldType = DatabaseColumnsConfigType[number];
type ValidateRuleType = ControllerProps["rules"];
type FormType = { [name: string]: string | number };

export type MetadataInputFieldListProps = {
  fields: FieldType[];
  prefixInputElementId: string;
  formControl: Control<FormType>;
  validateRules: Record<keyof FormType, ValidateRuleType>;
};

export const MetadataInputFieldList = ({
  fields,
  prefixInputElementId,
  formControl,
  validateRules,
}: MetadataInputFieldListProps): JSX.Element => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {fields.map((field) => {
        const name = field.name;
        const displayName = field.display_name;
        const necessity = field.necessity;
        const required = necessity === "required";
        const recommended = necessity === "recommended";
        const dataTypeMap = {
          string: "text" as const,
          str: "text" as const,
          text: "text" as const,
          integer: "text" as const,
          int: "text" as const,
          float: "text" as const,
          double: "text" as const,
          number: "text" as const,
          datetime: "datetime-local" as const,
        };
        const inputModeMap = {
          string: "text" as const,
          str: "text" as const,
          text: "text" as const,
          integer: "numeric" as const,
          int: "numeric" as const,
          float: "decimal" as const,
          double: "decimal" as const,
          number: "decimal" as const,
          datetime: "none" as const,
        };
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
              <Controller
                name={name}
                control={formControl}
                rules={validateRules[name]}
                render={({
                  field: hookFormProps,
                  fieldState: { error: validateError },
                }) => {
                  return (
                    <TextField
                      {...hookFormProps}
                      id={id}
                      fullWidth
                      type={dataTypeMap[field.dtype]}
                      inputMode={inputModeMap[field.dtype]}
                      error={Boolean(validateError)}
                      helperText={
                        validateError
                          ? validateError.message
                          : required || recommended
                          ? `This is ${necessity}`
                          : undefined
                      }
                    />
                  );
                }}
              />
            </Box>
            <Spacer direction="vertical" size="3vh" />
          </div>
        );
      })}
    </Box>
  );
};
