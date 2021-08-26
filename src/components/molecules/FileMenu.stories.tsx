import { useState, MouseEventHandler } from "react";
import { FileMenu } from "./FileMenu";

export default {
  component: FileMenu,
  title: "FileMenu",
};

export const Controlled = (): JSX.Element => {
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
      <FileMenu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={onMenuClose}
        onDelete={() => window.alert("delete!")}
        onEdit={() => window.alert("edit!")}
        onPreview={() => window.alert("preview!")}
        onDownload={() => window.alert("download!")}
      />
    </div>
  );
};
