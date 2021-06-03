import TextField from "@material-ui/core/TextField";
import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";

type MetadataType = Record<string, unknown>;
type InputConfigType = {
  name: string;
  necessity: string;
  display_name: string;
};

type ComponentProps = {
  currentMetadata?: MetadataType;
  inputConfig: InputConfigType[];
  nonFilledRequiredFieldNames: string[];
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
  inputConfig,
  nonFilledRequiredFieldNames,
}: ComponentProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {inputConfig.map((inputField) => {
        const name = inputField.name;
        const displayName = inputField.display_name;
        const necessity = inputField.necessity;
        const required = necessity === "required";
        const recommended = necessity === "recommended";
        const id = `RecordEditModalInputFields_${name.replace(/\s+/g, "")}`;
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
                key={inputField.name}
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
