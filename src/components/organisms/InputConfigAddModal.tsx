import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Autocomplete, {
  AutocompleteProps,
  createFilterOptions,
} from "@material-ui/core/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  useForm,
  Controller,
  ControllerProps,
  Control,
  FieldErrors,
} from "react-hook-form";
import {
  DialogToolBar,
  DialogBody,
  DialogCloseButton,
  DialogContainer,
  DialogWrapper,
  DialogMain,
  DialogSubTitle,
} from "@dataware-tools/app-common";
import {
  DatabaseColumnsConfigType,
  DatabaseColumnsConfigNecessityType,
} from "utils";
import { FormControl, FormHelperText } from "@material-ui/core";

type OptionType = {
  name: string;
  display_name: string;
  newOption?: boolean;
};
type NewColumnType = Required<
  Pick<DatabaseColumnsConfigType[number], "display_name" | "name" | "necessity">
>;
type NameAutocompleteProps = AutocompleteProps<OptionType, false, false, true>;
type ValidateRuleType = ControllerProps["rules"];

type Props = {
  formControl: Control<NewColumnType>;
  validateRules: Record<keyof NewColumnType, ValidateRuleType>;
  validateErrors: FieldErrors<NewColumnType>;
  validateErrorMessages: Record<
    keyof NewColumnType,
    Record<keyof ValidateRuleType, string>
  >;
  filterNameOptions: NameAutocompleteProps["filterOptions"];
  getNameOptionLabel: NameAutocompleteProps["getOptionLabel"];
  necessity?: DatabaseColumnsConfigNecessityType;
  onAdd: () => void;
} & Omit<
  ContainerProps,
  "onSave" | "alreadyUsedNames" | "alreadyUsedDisplayNames"
>;

type ContainerProps = {
  options: OptionType[];
  open: boolean;
  onClose: () => void;
  onSave: (newConfig: NewColumnType) => void;
  alreadyUsedNames: string[];
  alreadyUsedDisplayNames: string[];
};
const Component = ({
  open,
  options,
  onClose,
  filterNameOptions,
  getNameOptionLabel,
  onAdd,
  formControl,
  validateRules,
  validateErrors,
  validateErrorMessages,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogContainer padding="0 0 20px">
          <DialogBody>
            <DialogMain>
              <DialogSubTitle>Name</DialogSubTitle>
              <Controller
                name="name"
                control={formControl}
                rules={validateRules.name}
                shouldUnregister
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(validateErrors.name)}
                          helperText={
                            (validateErrors.name &&
                              validateErrorMessages.name[
                                validateErrors.name?.type
                              ]) ||
                            (field.value &&
                              !options.some(
                                (option) => option.name === field.value
                              ) &&
                              `"${field.value}" column not exist in DB, so this column will created`)
                          }
                        />
                      )}
                      options={options}
                      onChange={(_, newValue) => {
                        if (typeof newValue === "string") {
                          field.onChange(newValue);
                        } else if (newValue) {
                          field.onChange(newValue.name);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      filterOptions={filterNameOptions}
                      getOptionLabel={getNameOptionLabel}
                      freeSolo
                      filterSelectedOptions
                      fullWidth
                    />
                  );
                }}
              />
              <>
                <DialogSubTitle>Display name</DialogSubTitle>
                <Controller
                  name="display_name"
                  control={formControl}
                  rules={validateRules.display_name}
                  shouldUnregister
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={Boolean(validateErrors.display_name)}
                      helperText={
                        validateErrors.display_name &&
                        validateErrorMessages.display_name[
                          validateErrors.display_name.type
                        ]
                      }
                      fullWidth
                    />
                  )}
                />
                <DialogSubTitle>Necessity</DialogSubTitle>
                <Controller
                  name="necessity"
                  control={formControl}
                  rules={validateRules.necessity}
                  defaultValue="required"
                  shouldUnregister
                  render={({ field }) => (
                    <FormControl error={Boolean(validateErrors.necessity)}>
                      <Select {...field} variant="outlined">
                        <MenuItem value="required">Required</MenuItem>
                        <MenuItem value="recommended">Recommended</MenuItem>
                        <MenuItem value="optional">Optional</MenuItem>
                      </Select>
                      {validateErrors.necessity ? (
                        <FormHelperText>
                          {
                            validateErrorMessages.necessity[
                              validateErrors.necessity.type
                            ]
                          }
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
              </>
            </DialogMain>
            <DialogToolBar right={<Button onClick={onAdd}>Add</Button>} />
          </DialogBody>
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};
const Container = ({
  options,
  open,
  onClose,
  onSave,
  alreadyUsedNames,
  alreadyUsedDisplayNames,
}: ContainerProps): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors: validateErrors },
  } = useForm<NewColumnType>();

  const validateRules = {
    name: {
      required: true,
      validate: {
        invalid: (name: string) => {
          const reg = /^[a-zA-Z0-9]{1}[a-zA-Z0-9_\-()]*$/;
          return reg.test(name);
        },
        duplicate: (name: string) => !alreadyUsedNames.includes(name),
      },
    },
    display_name: {
      required: true,
      validate: {
        duplicate: (displayName: string) =>
          !alreadyUsedDisplayNames.includes(displayName),
      },
    },
    necessity: {
      required: true,
    },
  };
  const validateErrorMessages = {
    name: {
      required: "Name is required",
      invalid: "Invalid name",
      duplicate: "This name is already existed on DB",
    },
    display_name: {
      required: "Display name is required",
      duplicate: "This display name is already used",
    },
    necessity: { required: "Necessity is required" },
  };

  const filter = createFilterOptions<OptionType>();
  const filterNameOptions: Props["filterNameOptions"] = (options, params) => {
    const filtered = filter(options, params);
    const { inputValue } = params;

    const isExisting =
      options.some((option) => inputValue === option.name) ||
      alreadyUsedNames.includes(inputValue);
    if (inputValue !== "" && !isExisting) {
      filtered.push({
        newOption: true,
        name: inputValue,
        display_name: inputValue,
      });
    }

    return filtered;
  };

  const getNameOptionLabel: Props["getNameOptionLabel"] = (option) => {
    if (typeof option === "string") {
      return option;
    }
    return option.name;
  };

  const onAdd = handleSubmit((data) => {
    onSave(data);
    onClose();
  });

  return (
    <Component
      validateErrors={validateErrors}
      validateErrorMessages={validateErrorMessages}
      validateRules={validateRules}
      formControl={control}
      filterNameOptions={filterNameOptions}
      getNameOptionLabel={getNameOptionLabel}
      onAdd={onAdd}
      onClose={onClose}
      open={open}
      options={options}
    />
  );
};

export { Container as InputConfigAddModal };
export type { ContainerProps as InputConfigAddModalProps, NewColumnType };
