import { Story } from "@storybook/react";
import { useState } from "react";
import {
  OptionSharingSelects,
  OptionSharingSelectsProps,
} from "./OptionSharingSelects";

export default {
  component: OptionSharingSelects,
  title: "OptionSharingSelects",
};

const Template: Story<OptionSharingSelectsProps> = (args) => (
  <OptionSharingSelects {...args} />
);

export const Default = Template.bind({});
Default.args = {
  options: [
    { label: "Test", value: "test" },
    { label: "Test1", value: "test1" },
    { label: "Test2", value: "test2" },
    { label: "Test3", value: "test3" },
  ],
  onChange: (newValue) => window.alert(newValue),
  values: ["test", "test1"],
  creatable: true,
  deletable: true,
};

export const Controlled = (): JSX.Element => {
  const [values, setValues] = useState(["test"]);
  return (
    <div style={{ width: "30vw" }}>
      <OptionSharingSelects
        values={values}
        onChange={(newValues) => setValues(newValues)}
        options={[
          { label: "Test", value: "test" },
          { label: "Test1", value: "test1" },
          { label: "Test2", value: "test2" },
          { label: "Test3", value: "test3" },
        ]}
        creatable
        deletable
      />
    </div>
  );
};
