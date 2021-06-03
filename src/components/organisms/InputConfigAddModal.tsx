import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { DialogContainer } from "components/atoms/DialogContainer";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogToolBar } from "components/atoms/DialogToolBar";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/core/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { useState, useEffect } from "react";
import { DataBrowserInputConfigType, usePrevious } from "utils";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

type OptionType = {
  name: string;
  display_name: string;
  inputValue?: string;
};

type NewConfigType = {
  name: string;
  display_name: string;
  necessity: DataBrowserInputConfigType[number]["necessity"];
};

type ContainerProps = {
  options: OptionType[];
  open: boolean;
  onClose: () => void;
  onSave: (newConfig: NewConfigType) => void;
  alreadyUsedDisplayNames: string[];
};
const Container = ({
  options,
  open,
  onClose,
  onSave,
  alreadyUsedDisplayNames,
}: ContainerProps): JSX.Element => {
  const [name, setName] = useState<OptionType | null>(null);
  const [nameValidateError, setNameValidateError] = useState<string | null>(
    null
  );
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [displayNameValidateError, setDisplayNameValidateError] = useState<
    string | null
  >(null);
  const [necessity, setNecessity] = useState<
    DataBrowserInputConfigType[number]["necessity"] | null
  >(null);

  const initializeState = () => {
    setName(null);
    setNameValidateError(null);
    setDisplayName(null);
    setDisplayNameValidateError(null);
    setNecessity(null);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const filter = createFilterOptions<OptionType>();

  useEffect(() => {
    if (name) {
      const reg = /^[a-zA-Z0-9]{1}[a-zA-Z0-9_\-()]*$/;
      if (!reg.test(name.name) || name.name === "") {
        setNameValidateError("invalid field name");
      } else {
        setNameValidateError(null);
        if (!displayName) {
          setDisplayName(name.display_name);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    if (displayName != null) {
      if (
        displayName !== name?.display_name &&
        alreadyUsedDisplayNames.includes(displayName)
      ) {
        setDisplayNameValidateError("duplicated display name");
      } else if (displayName === "") {
        setDisplayNameValidateError("display name is required");
      } else {
        setDisplayNameValidateError(null);
      }
    }
  }, [displayName, alreadyUsedDisplayNames, name]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContainer height="100%">
        <DialogCloseButton onClick={onClose} />
        <DialogBody flexDirection="column">
          <div>Name</div>
          <Autocomplete
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(nameValidateError)}
                helperText={nameValidateError}
              />
            )}
            options={options}
            value={name}
            onChange={(_, newValue) => {
              if (typeof newValue === "string") {
                setName({
                  name: newValue,
                  display_name: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                setName({
                  name: newValue.inputValue,
                  display_name: newValue.inputValue,
                });
              } else {
                setName(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;

              const isExisting = options.some(
                (option) => inputValue === option.name
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue,
                  name: inputValue,
                  display_name: inputValue,
                });
              }

              return filtered;
            }}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return `Add ${option.inputValue}`;
              }
              return option.name;
            }}
            freeSolo
            filterSelectedOptions
            fullWidth
          />

          {name ? (
            <>
              <div>Display name</div>
              <TextField
                value={displayName}
                error={Boolean(displayNameValidateError)}
                helperText={displayNameValidateError}
                onChange={(event) => {
                  const currentValue = event.target.value;
                  setDisplayName(currentValue);
                }}
              />
              <div>Necessity</div>
              <Select
                value={necessity}
                onChange={(event) => setNecessity(event.target.value)}
                variant="outlined"
                error={Boolean(!necessity)}
              >
                <MenuItem value="required">Required</MenuItem>
                <MenuItem value="recommended">Recommended</MenuItem>
                <MenuItem value="optional">Optional</MenuItem>
              </Select>
            </>
          ) : null}
        </DialogBody>
        <DialogToolBar
          right={
            <Button
              onClick={() => {
                if (name && displayName && necessity) {
                  onSave({
                    name: name.name,
                    display_name: displayName,
                    necessity,
                  });
                }
                onClose();
              }}
              disabled={Boolean(
                !name?.name ||
                  !displayName ||
                  !necessity ||
                  nameValidateError ||
                  displayNameValidateError
              )}
            >
              Add
            </Button>
          }
        />
      </DialogContainer>
    </Dialog>
  );
};

export { Container as InputConfigAddModal };
export type { ContainerProps as InputConfigAddModalProps, NewConfigType };