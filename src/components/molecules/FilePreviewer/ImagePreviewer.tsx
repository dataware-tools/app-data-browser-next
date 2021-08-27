import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  imageContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
});

type ImagePreviewerProps = { url: string };
export const ImagePreviewer = ({ url }: ImagePreviewerProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.imageContainer}>
      <img src={url} alt="preview of image file" />
    </div>
  );
};
