import TextField from "@material-ui/core/TextField";
import { Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";

type ComponentProps = {
  data?: Record<string, unknown>;
  inputFields: { name: string; necessity: string }[];
  nonFilledRequiredFields: string[];
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
  data,
  inputFields,
  nonFilledRequiredFields,
}: ComponentProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {inputFields.map((inputField) => {
        const name = inputField.name;
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
              {name}
            </label>
            <div className={classes.inputContainer}>
              <TextField
                fullWidth
                key={inputField.name}
                id={id}
                defaultValue={data?.[name]}
                error={nonFilledRequiredFields.includes(name)}
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
