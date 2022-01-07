import { useForm } from "react-hook-form";
import { MetadataInputFieldList } from "./MetadataInputFieldList";

export default {
  component: MetadataInputFieldList,
  title: "MetadataInputFieldList",
};

export const Default = (): JSX.Element => {
  const { control: formControl } = useForm();
  const validateRules = {
    required: {
      required: {
        value: true,
        message: `Required is required`,
      },
    },
    recommended: {},
    optional: {},
  };
  return (
    <MetadataInputFieldList
      fields={[
        {
          name: "required",
          display_name: "Required",
          necessity: "required",
          dtype: "string",
          aggregation: "first",
        },
        {
          name: "recommended",
          display_name: "Recommended",
          necessity: "recommended",
          dtype: "string",
          aggregation: "first",
        },
        {
          name: "optional",
          display_name: "Optional",
          necessity: "optional",
          dtype: "string",
          aggregation: "first",
        },
      ]}
      formControl={formControl}
      validateRules={validateRules}
      prefixInputElementId="#"
    />
  );
};
