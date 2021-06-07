import { makeStyles } from "@material-ui/core/styles";
import { theme as themeInstance } from "@dataware-tools/app-common";
import { MouseEventHandler, ReactNode } from "react";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  button: {
    alignItems: "center",
    cursor: (props: ContainerProps) => (props.disabled ? "unset" : "pointer"),
    display: "flex",
    height: "40px",
    justifyContent: "center",
    opacity: (props: ContainerProps) => (props.disabled ? "50%" : "unset"),
    width: "40px",
    "&:hover": {
      backgroundColor: (props: ContainerProps) =>
        props.disabled ? "unset" : theme.palette.action.hover,
    },
  },
}));

type ContainerProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  icon: ReactNode;
};

const Container = ({
  icon,
  onClick,
  disabled,
}: ContainerProps): JSX.Element => {
  const classes = useStyles({ icon, onClick, disabled });
  return (
    <div className={classes.button} onClick={disabled ? undefined : onClick}>
      {icon}
    </div>
  );
};

export { Container as SquareIconButton };
export type { ContainerProps as SquareIconButtonProps };
