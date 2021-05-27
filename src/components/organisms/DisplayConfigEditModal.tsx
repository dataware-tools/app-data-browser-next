import { ToolBar } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "../../utils/index";
import { DisplayConfigList } from "components/organisms/DisplayConfigList";

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
  bodyContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    overflow: "auto",
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
  recordDisplayConfig: ["record name", "description"],
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
        <div className={classes.bodyContainer}>
          <DisplayConfigList
            value={databaseConfig.recordDisplayConfig || []}
            onChange={(newValue) =>
              setDatabaseConfig({
                ...databaseConfig,
                recordDisplayConfig: newValue,
              })
            }
            options={
              databaseConfig.recordInputConfig?.map((config) => config.name) ||
              []
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

export { Container as DisplayConfigEditModal };
export type { ContainerProps as DisplayConfigEditModalProps };
