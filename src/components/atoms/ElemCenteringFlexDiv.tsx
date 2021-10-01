import Box from "@mui/material/Box";
import { ReactNode } from "react";

export type ElemCenteringFlexDivProps = {
  children: ReactNode;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
};

export const ElemCenteringFlexDiv = ({
  children,
  flexDirection,
}: ElemCenteringFlexDivProps): JSX.Element => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: flexDirection || "initial",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
};
