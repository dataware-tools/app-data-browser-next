import {
  DialogToolBar,
  DialogBody,
  DialogCloseButton,
  DialogContainer,
  DialogWrapper,
  DialogMain,
  DialogSubTitle,
} from "@dataware-tools/app-common";
import Autocomplete, {
  AutocompleteProps,
  createFilterOptions,
} from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import {
  useForm,
  Controller,
  ControllerProps,
  Control,
  FieldErrors,
} from "react-hook-form";
import {
  DatabaseColumnsConfigType,
  DatabaseColumnsConfigNecessityType,
} from "utils";

type OptionType = {
  name: string;
  display_name: string;
  newOption?: boolean;
};
export type NewColumnType = DatabaseColumnsConfigType[number];

type NameAutocompleteProps = AutocompleteProps<OptionType, false, false, true>;
type ValidateRuleType = ControllerProps["rules"];
type FormType = Pick<
  NewColumnType,
  "display_name" | "dtype" | "is_secret" | "name" | "necessity"
>;

export type InputConfigListItemModalPresentationProps = {
  formControl: Control<FormType>;
  validateRules: Record<keyof FormType, ValidateRuleType>;
  validateErrors: FieldErrors<FormType>;
  validateErrorMessages: Record<
    keyof FormType,
    Record<keyof ValidateRuleType, string>
  >;
  filterNameOptions: NameAutocompleteProps["filterOptions"];
  getNameOptionLabel: NameAutocompleteProps["getOptionLabel"];
  necessity?: DatabaseColumnsConfigNecessityType;
  onAdd: () => void;
  onUpdate: () => void;
  hasInitialData: boolean;
} & Omit<
  InputConfigListItemModalProps,
  "onSave" | "alreadyUsedNames" | "alreadyUsedDisplayNames" | "initialData"
>;

export type InputConfigListItemModalProps = {
  options: OptionType[];
  open: boolean;
  onClose: () => void;
  onSave: (newConfig: FormType) => void;
  alreadyUsedNames: string[];
  alreadyUsedDisplayNames: string[];
  initialData: NewColumnType | null;
};

export const InputConfigListItemModalPresentation = ({
  open,
  options,
  onClose,
  filterNameOptions,
  getNameOptionLabel,
  onAdd,
  onUpdate,
  formControl,
  validateRules,
  validateErrors,
  validateErrorMessages,
  hasInitialData,
}: InputConfigListItemModalPresentationProps): JSX.Element => {
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
                            (!hasInitialData &&
                              field.value &&
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
                      autoSelect
                      disabled={hasInitialData}
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
                <DialogSubTitle>Data type</DialogSubTitle>
                <Controller
                  name="dtype"
                  control={formControl}
                  rules={validateRules.dtype}
                  defaultValue="string"
                  render={({ field }) => (
                    <FormControl error={Boolean(validateErrors.dtype)}>
                      <Select
                        {...field}
                        variant="outlined"
                        disabled={
                          !["string", "number", "datetime"].includes(
                            field.value
                          )
                        }
                      >
                        <MenuItem value="string">String</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                        <MenuItem value="datetime">Datetime</MenuItem>
                      </Select>
                      {!["string", "number", "datetime"].includes(
                        field.value
                      ) ? (
                        <FormHelperText>
                          Data type {field.value} is not supported on data
                          browser
                        </FormHelperText>
                      ) : null}
                      {validateErrors.dtype ? (
                        <FormHelperText>
                          {
                            validateErrorMessages.dtype[
                              validateErrors.dtype.type
                            ]
                          }
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
                <DialogSubTitle>Necessity</DialogSubTitle>
                <Controller
                  name="necessity"
                  control={formControl}
                  rules={validateRules.necessity}
                  defaultValue="required"
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
                <DialogSubTitle>Visibility</DialogSubTitle>
                <Controller
                  name="is_secret"
                  control={formControl}
                  rules={validateRules.is_secret}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControl error={Boolean(validateErrors.is_secret)}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => field.onChange(e.target.checked)}
                            checked={field.value}
                          />
                        }
                        label="Hide from restricted users"
                      />
                    </FormControl>
                  )}
                />
              </>
            </DialogMain>
            <DialogToolBar
              right={
                hasInitialData ? (
                  <Button onClick={onUpdate}>OK</Button>
                ) : (
                  <Button onClick={onAdd}>Add</Button>
                )
              }
            />
          </DialogBody>
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export const InputConfigListItemModal = ({
  options,
  open,
  onClose,
  onSave,
  alreadyUsedNames,
  alreadyUsedDisplayNames,
  initialData,
}: InputConfigListItemModalProps): JSX.Element => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors: validateErrors },
  } = useForm<FormType>();

  useEffect(() => {
    if (initialData) {
      const fixedDtype = {
        string: "string" as const,
        str: "string" as const,
        text: "string" as const,
        float: "number" as const,
        double: "number" as const,
        number: "number" as const,
        datetime: "datetime" as const,
      };
      setValue("name", initialData.name);
      setValue("display_name", initialData.display_name);
      setValue("necessity", initialData.necessity);
      setValue("is_secret", initialData.is_secret);
      setValue("dtype", fixedDtype[initialData.dtype] || initialData.dtype);
    } else {
      reset();
    }
  }, [open, initialData, setValue, reset]);

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
    is_secret: {},
    dtype: { required: true },
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
    is_secret: {},
    dtype: { required: "Dtype is required" },
  };

  const filter = createFilterOptions<OptionType>();
  const filterNameOptions: InputConfigListItemModalPresentationProps["filterNameOptions"] =
    (options, params) => {
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

  const getNameOptionLabel: InputConfigListItemModalPresentationProps["getNameOptionLabel"] =
    (option) => {
      if (typeof option === "string") {
        return option;
      }
      return option.name;
    };

  const onAdd = handleSubmit((data) => {
    console.log(data);
    onSave({ ...data });
    onClose();
  });

  const onUpdate = handleSubmit((data) => {
    onSave({ ...data });
    onClose();
  });

  return (
    <InputConfigListItemModalPresentation
      validateErrors={validateErrors}
      validateErrorMessages={validateErrorMessages}
      validateRules={validateRules}
      formControl={control}
      filterNameOptions={filterNameOptions}
      getNameOptionLabel={getNameOptionLabel}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onClose={onClose}
      open={open}
      options={options}
      hasInitialData={!!initialData}
    />
  );
};
