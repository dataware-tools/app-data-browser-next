import Box from "@mui/material/Box";
type ImagePreviewerProps = { url: string };
export const ImagePreviewer = ({ url }: ImagePreviewerProps): JSX.Element => {
  return (
    <Box
      sx={{ alignItems: "center", display: "flex", justifyContent: "center" }}
    >
      <img src={url} alt="preview of image file" />
    </Box>
  );
};
