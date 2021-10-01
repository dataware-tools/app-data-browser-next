import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

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
