import { Spacer } from "@dataware-tools/app-common";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { DatabaseColumnsConfigType } from "utils";

type MetadataType = Record<string, unknown>;

type FieldType = Pick<
  DatabaseColumnsConfigType[number],
  "display_name" | "name" | "necessity"
>;

type ComponentProps = {
  currentMetadata?: MetadataType;
  fields: FieldType[];
  nonFilledRequiredFieldNames: string[];
  prefixInputElementId: string;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "1.5rem",
  },
  inputContainer: {
    padding: "0 3vw",
  },
});

const Component = ({
  currentMetadata,
  fields,
  nonFilledRequiredFieldNames,
  prefixInputElementId,
}: ComponentProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {fields.map((field) => {
        const name = field.name;
        const displayName = field.display_name;
        const necessity = field.necessity;
        const required = necessity === "required";
        const recommended = necessity === "recommended";
        const id = `${prefixInputElementId}_${name.replace(/\s+/g, "")}`;
        return (
          <div key={name}>
            <label
              htmlFor={id}
              className={classes.label}
              style={required ? { fontWeight: "bold" } : undefined}
            >
              {displayName}
            </label>
            <div className={classes.inputContainer}>
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
            </div>
            <Spacer direction="vertical" size="3vh" />
          </div>
        );
      })}
    </div>
  );
};
export { Component as MetadataInputFieldList };
export type { ComponentProps as MetadataInputFieldListProps };
