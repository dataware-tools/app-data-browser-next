import { DatabaseMenu } from "./DatabaseMenu";
import { useState, MouseEventHandler } from "react";

export default {
  component: DatabaseMenu,
  title: "DatabaseMenu",
};

export const Default = (): JSX.Element => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLButtonElement>(
    null
  );
  const isMenuOpen = Boolean(menuAnchorEl);
  const onMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div>
      <button onClick={onMenuOpen}>click me!</button>
      <DatabaseMenu
        open={isMenuOpen}
        onClick={(target) => window.alert(`click ${target}!`)}
        onClose={onMenuClose}
        anchorEl={menuAnchorEl}
        menu={[{ label: "Test", value: "Test value" }]}
      />
    </div>
  );
};
