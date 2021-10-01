import { Spacer } from "@dataware-tools/app-common";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import { ReactNode, useState } from "react";

export type FileMenuItemPresentationProps = {
  pending: boolean;
} & FileMenuItemProps;

export type FileMenuItemProps = {
  onClick: () => void | Promise<void>;
  icon: ReactNode;
  text: string;
};

export const FileMenuItemPresentation = ({
  onClick,
  pending,
  icon,
  text,
}: FileMenuItemPresentationProps): JSX.Element => (
  <MenuItem onClick={onClick} disabled={pending}>
    {pending ? <CircularProgress size="1rem" /> : icon}
    <Spacer direction="horizontal" size="5px" />
    {text}
  </MenuItem>
);

export const FileMenuItem = ({
  onClick,
  ...delegated
}: FileMenuItemProps): JSX.Element => {
  const [pending, setPending] = useState(false);
  const _onClick = async () => {
    setPending(true);
    await onClick();
    setPending(false);
  };

  return (
    <FileMenuItemPresentation
      pending={pending}
      onClick={_onClick}
      {...delegated}
    />
  );
};
