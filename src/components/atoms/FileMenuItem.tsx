import MenuItem from "@material-ui/core/MenuItem";
import { ReactNode } from "react";
import { Spacer } from "@dataware-tools/app-common";

type ComponentProps = {
  onClick: () => void;
  icon: ReactNode;
  text: string;
};

const Component = ({ onClick, icon, text }: ComponentProps): JSX.Element => (
  <MenuItem onClick={onClick}>
    {icon}
    <Spacer direction="horizontal" size="5px" />
    {text}
  </MenuItem>
);

export { Component as FileMenuItem };
export type { ComponentProps as FileMenuItemProps };
