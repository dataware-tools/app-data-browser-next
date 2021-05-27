import { ToolBar, Spacer } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "../../utils/index";
import { InputConfigList } from "components/organisms/InputConfigList";
import AddCircleIcon from "@material-ui/icons/AddCircle";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    padding: "10px",
  },
  title: {
    fontSize: "1.5rem",
    marginLeft: "3vw",
  },
  bodyContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    overflow: "auto",
    padding: "0 2vw",
  },
  label: {
    fontSize: "1.5rem",
  },
  inputContainer: {
    padding: "0 3vw",
  },
  ToolBarContainer: {
    padding: "5px",
  },
});

// TODO: fetch from server
const getDatabaseConfigRes = {
  recordInputConfig: [
    { name: "record name", necessity: "required" },
    { name: "required", necessity: "required" },
    { name: "recommended", necessity: "recommended" },
    { name: "description", necessity: "optional" },
    { name: "optional", necessity: "optional" },
  ],
  fileInputConfig: [{ name: "description", necessity: "required" }],
  recordDisplayConfig: ["name", "description"],
};

const Container = ({ open, onClose }: ContainerProps): JSX.Element => {
  const classes = useStyles();

  const [isSaving, setIsSaving] = useState(false);
  // TODO: initialize state after success fetching
  const [databaseConfig, setDatabaseConfig] = useState(getDatabaseConfigRes);

  const initializeState = () => {
    setIsSaving(false);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onSave = async () => {
    setIsSaving(true);
    // TODO: implement onSave
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <div className={classes.root}>
        <DialogCloseButton onClick={onClose} />
        <div className={classes.title}>
          Record Input Fields{" "}
          <AddCircleIcon
            onClick={() =>
              setDatabaseConfig((prev) => {
                console.log(`prev add: ${prev.recordInputConfig.length}`);
                const newValue = { ...prev };
                newValue.recordInputConfig.push({
                  name: "",
                  necessity: "required",
                });
                console.log(`next add: ${newValue.recordInputConfig.length}`);
                return newValue;
              })
            }
          />
        </div>
        <Spacer direction="vertical" size="2vh" />
        <div className={classes.bodyContainer}>
          <InputConfigList
            // @ts-expect-error bug tracking
            value={
              Boolean(
                console.log(
                  `in InputConfigEditModal: ${databaseConfig.recordInputConfig.length}`
                )
              ) ||
              databaseConfig.recordInputConfig || [
                { name: "Record name", necessity: "required" },
              ]
            }
            onChange={(newValue) =>
              setDatabaseConfig((prev) => {
                console.log(`prev delete: ${prev.recordInputConfig.length}`);
                console.log(`next delete: ${newValue.length}`);
                return { ...prev, recordInputConfig: newValue };
              })
            }
          />
        </div>
        <ToolBar>
          <LoadingButton pending={isSaving} onClick={onSave}>
            Save
          </LoadingButton>
        </ToolBar>
      </div>
    </Dialog>
  );
};

export { Container as InputConfigEditModal };
export type { ContainerProps as InputConfigEditModalProps };
