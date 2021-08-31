import Box from "@material-ui/core/Box";
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
