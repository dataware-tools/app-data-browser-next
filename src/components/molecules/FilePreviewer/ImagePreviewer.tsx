import { makeStyles } from "@material-ui/core/styles";

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
      <img src={url} />
    </div>
  );
};
