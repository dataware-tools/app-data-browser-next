import { useForm } from "react-hook-form";
import { DatabaseDeleteModalPresentation } from "./DatabaseDeleteModal";

export default {
  component: DatabaseDeleteModalPresentation,
  title: "DatabaseDeleteModal",
};

export const Default = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors: validateErrors },
  } = useForm<{ databaseId: string }>();
  const validateRules = {
    databaseId: {
      required: true,
    },
  };
  const validateErrorMessages = {
    databaseId: {
      required: "required",
    },
  };
  return (
    <DatabaseDeleteModalPresentation
      validateErrors={validateErrors}
      validateErrorMessages={validateErrorMessages}
      validateRules={validateRules}
      formControl={control}
      databaseId="test"
      onClose={() => {
        handleSubmit((data) => console.log(data))();
        return { cancelCloseModal: true };
      }}
    />
  );
};
