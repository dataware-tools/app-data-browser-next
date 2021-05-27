import { MouseEvent, useState } from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/core/styles";
import {
  DatabaseConfigMenu,
  DatabaseConfigMenuProps,
} from "components/molecules/DatabaseConfigMenu";
import { theme as themeInstance } from "@dataware-tools/app-common";

type Props = {
  classes: ReturnType<typeof useStyles>;
  onOpen: (event: MouseEvent<HTMLDivElement>) => void | Promise<void>;
  onClose: DatabaseConfigMenuProps["onClose"];
  open: DatabaseConfigMenuProps["open"];
  anchorEl: DatabaseConfigMenuProps["anchorEl"];
} & ContainerProps;

type ContainerProps = {
  onMenuSelect: DatabaseConfigMenuProps["onClick"];
  menu: DatabaseConfigMenuProps["menu"];
};

const Component = ({
  classes,
  onOpen,
  onMenuSelect,
  ...delegated
}: Props): JSX.Element | null => {
  return (
    <div>
      <div className={classes.button} onClick={onOpen}>
        <SettingsIcon />
      </div>
      <DatabaseConfigMenu {...delegated} onClick={onMenuSelect} />
    </div>
  );
};

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  button: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    height: "40px",
    justifyContent: "center",
    width: "40px",
    "&:hover": { backgroundColor: theme.palette.action.hover, },
  },
}));

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const classes = useStyles();

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLDivElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const onMenuOpen: Props["onOpen"] = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Component
      classes={classes}
      onOpen={onMenuOpen}
      open={isMenuOpen}
      onClose={onMenuClose}
      anchorEl={menuAnchorEl}
      {...delegated}
    />
  );
};

export { Container as DatabaseConfigButton };
export type { ContainerProps as DatabaseConfigButtonProps };
