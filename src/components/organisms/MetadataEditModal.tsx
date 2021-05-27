import {
  ErrorMessage,
  LoadingIndicator,
  ToolBar,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import useSWR from "swr";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "../../utils/index";
import { MetadataInputFields } from "components/organisms/MetadataInputFields";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  recordId?: string;
  getMetadata: () => Promise<any>;
  getMetadataURL: string;
  onSubmit: (newRecordInfo: Record<string, unknown>) => Promise<boolean>;
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

// TODO: inputFields should be fetched from server
const inputFields = [
  { name: "record name", necessity: "required" },
  { name: "required", necessity: "required" },
  { name: "recommended", necessity: "recommended" },
  { name: "description", necessity: "optional" },
  { name: "optional", necessity: "optional" },
];

const Container = ({
  open,
  onClose,
  recordId,
  getMetadataURL,
  getMetadata,
  onSubmit,
}: ContainerProps): JSX.Element => {
  const classes = useStyles();

  const [isSaving, setIsSaving] = useState(false);
  const [nonFilledRequiredsFields, setNonFilledRequireds] = useState<string[]>(
    []
  );

  const initializeState = () => {
    setIsSaving(false);
    setNonFilledRequireds([]);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const { data: getRecordRes, error: getRecordError } = useSWR(
    getMetadataURL,
    getMetadata
  );

  const onSave = async () => {
    setIsSaving(true);
    // TODO: fixAPI
    const newRecordInfo = recordId ? {} : { record_id: Date.now().toString() };

    const nonFilledRequireds: string[] = [];
    const nonFilledRecommends: string[] = [];

    inputFields.forEach((inputField) => {
      const inputEl = document.getElementById(
        `RecordEditModalInputFields_${inputField.name.replace(/\s+/g, "")}`
      ) as HTMLInputElement;
      if (inputField.necessity === "required" && !inputEl.value) {
        nonFilledRequireds.push(inputField.name);
      }
      if (inputField.necessity === "recommended" && !inputEl.value) {
        nonFilledRecommends.push(inputField.name);
      }
    });

    if (nonFilledRequireds.length > 0) {
      window.alert(`${JSON.stringify(nonFilledRequireds)} is required`);
      setNonFilledRequireds(nonFilledRequireds);
      setIsSaving(false);
      return;
    }

    if (nonFilledRecommends.length > 0) {
      if (
        !window.confirm(
          `${JSON.stringify(
            nonFilledRecommends
          )} is recommended. Are you sure to save?`
        )
      ) {
        setIsSaving(false);
        return;
      }
    }

    inputFields.forEach((inputField) => {
      const inputEl = document.getElementById(
        `RecordEditModalInputFields_${inputField.name.replace(/\s+/g, "")}`
      ) as HTMLInputElement;
      newRecordInfo[inputField.name] = inputEl.value;
    });

    // * onSubmit
    const isSubmitSucceed = await onSubmit(newRecordInfo);

    if (!isSubmitSucceed) {
      setIsSaving(false);
      window.alert("save failed. please retry saving");
      return;
    }

    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xl" onClose={onClose}>
      <div className={classes.root}>
        <DialogCloseButton onClick={onClose} />
        {getRecordError ? (
          <ErrorMessage
            reason={JSON.stringify(getRecordError)}
            instruction="please reload this page"
          />
        ) : getRecordRes || !recordId ? (
          <>
            <div className={classes.bodyContainer}>
              <MetadataInputFields
                data={getRecordRes}
                inputFields={inputFields}
                nonFilledRequiredFields={nonFilledRequiredsFields}
              />
            </div>
            <ToolBar>
              <LoadingButton pending={isSaving} onClick={onSave}>
                Save
              </LoadingButton>
            </ToolBar>
          </>
        ) : (
          <LoadingIndicator />
        )}
      </div>
    </Dialog>
  );
};

export { Container as MetadataEditModal };
export type { ContainerProps as MetadataEditModalProps };
