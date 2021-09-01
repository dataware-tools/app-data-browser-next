import Box from "@material-ui/core/Box";
import AddIcon from "@material-ui/icons/Add";

export type AddListItemButtonProps = {
  onClick: () => void;
};

export const AddListItemButton = ({
  onClick,
}: AddListItemButtonProps): JSX.Element => {
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
