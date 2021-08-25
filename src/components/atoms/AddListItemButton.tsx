import Box from "@material-ui/core/Box";
import AddIcon from "@material-ui/icons/Add";

type Props = ContainerProps;

type ContainerProps = {
  onClick: () => void;
};

const Component = ({ onClick }: Props): JSX.Element => {
  return (
    <Box
      onClick={onClick}
      sx={{
        alignItems: "center",
        backgroundColor: "grey.300",
        cursor: "pointer",
        display: "flex",
        height: "40px",
        justifyContent: "center",
        maxHeight: "40px",
        minHeight: "40px",
        "&:hover": {
          backgroundColor: "grey.400",
        },
      }}
    >
      <AddIcon />
    </Box>
  );
};
const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  return <Component {...delegated} />;
};

export { Container as AddListItemButton };
export type { ContainerProps as AddListItemButtonProps };
