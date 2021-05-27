import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Spacer } from "@dataware-tools/app-common";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

type Props = {
  value: string;
  onChange: (action: "change" | "delete", newValue: string) => void;
  options: string[];
};

const Component = ({ value, onChange, options }: Props): JSX.Element => {
  // TODO: use useMemo
  return (
    <div>
      <Select
        value={value}
        onChange={(event) => onChange("change", event.target.value as string)}
        variant="outlined"
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
        <Spacer direction="horizontal" size="10px" />
      </Select>
      <IconButton onClick={() => onChange("delete", "")}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export { Component as DisplayConfigListItem };
export type { Props as DisplayConfigListItemProps };
