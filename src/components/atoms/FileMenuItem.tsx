import MenuItem from "@material-ui/core/MenuItem";
import { ReactNode, useState } from "react";
import { Spacer } from "@dataware-tools/app-common";
import CircularProgress from "@material-ui/core/CircularProgress";

type ComponentProps = {
  pending: boolean;
} & ContainerProps;

type ContainerProps = {
  onClick: () => void | Promise<void>;
  icon: ReactNode;
  text: string;
};

const Component = ({
  onClick,
  pending,
  icon,
  text,
}: ComponentProps): JSX.Element => (
  <MenuItem onClick={onClick} disabled={pending}>
    {pending ? <CircularProgress size="1rem" /> : icon}
    <Spacer direction="horizontal" size="5px" />
    {text}
  </MenuItem>
);

const Container = ({ onClick, ...delegated }: ContainerProps): JSX.Element => {
  const [pending, setPending] = useState(false);
  const _onClick = async () => {
    setPending(true);
    await onClick();
    setPending(false);
  };

  return <Component pending={pending} onClick={_onClick} {...delegated} />;
};

export { Container as FileMenuItem };
export type { ContainerProps as FileMenuItemProps };
