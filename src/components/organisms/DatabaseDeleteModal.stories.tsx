import { useForm } from "react-hook-form";
import { DatabaseDeleteModalDOM } from "./DatabaseDeleteModal";

export default {
  component: DatabaseDeleteModalDOM,
  title: "DatabaseDeleteModal",
};

export const Default = () => {
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
    <DatabaseDeleteModalDOM
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
