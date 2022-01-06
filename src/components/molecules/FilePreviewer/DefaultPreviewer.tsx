import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

export const DefaultPreviewer = (): JSX.Element => {
  return (
    <div>
      <p>Not supported for previewing.</p>

      <Button
        variant="contained"
        startIcon={<OpenInNewIcon />}
        component={Link}
        href="https://docs.dataware-tools.com/viewer-guide/webuapurikshon#purebydekiru"
        target="_blank"
        rel="noopener noreferrer"
      >
        List of supported file types
      </Button>
    </div>
  );
};
