import {
  Spacer,
  metaStore,
  API_ROUTE,
  ErrorMessage,
  LoadingIndicator,
  ToolBar,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import useSWR from "swr";
import { useAuth0 } from "@auth0/auth0-react";
import TextField from "@material-ui/core/TextField";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "../../utils/index";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  onSaveSucceeded: (newRecord: metaStore.RecordModel) => void;
  recordId?: string;
  databaseId: string;
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
  onSaveSucceeded,
  recordId,
  databaseId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently } = useAuth0();
  const classes = useStyles();

  const [isSaving, setIsSaving] = useState(false);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);

  const initializeState = () => {
    setIsSaving(false);
    setRequiredFields([]);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const getRecordURL = `${API_ROUTE.META.BASE}/databases/${databaseId}/records/${recordId}`;
  const getRecord = async () => {
    metaStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    if (recordId) {
      const listRecordsRes = await metaStore.RecordService.getRecord(
        recordId,
        databaseId
      );
      return listRecordsRes;
    } else {
      return undefined;
    }
  };

  const { data: getRecordRes, error: getRecordError } = useSWR(
    getRecordURL,
    getRecord
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
      setRequiredFields(nonFilledRequireds);
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

    metaStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    // TODO: fix API
    const saveRecordRes = recordId
      ? await metaStore.RecordService.updateRecord(
          recordId,
          databaseId,
          // @ts-expect-error fixAPI
          newRecordInfo
        ).catch(() => undefined)
      : await metaStore.RecordService.createRecord(
          databaseId,
          // @ts-expect-error fixAPI
          newRecordInfo
        ).catch(() => undefined);

    if (!saveRecordRes) {
      setIsSaving(false);
      window.alert("save failed. please retry saving");
      return;
    }

    onSaveSucceeded(saveRecordRes);
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
              {inputFields.map((inputField) => {
                const name = inputField.name;
                const necessity = inputField.necessity;
                const required = necessity === "required";
                const recommended = necessity === "recommended";
                const id = `RecordEditModalInputFields_${name.replace(
                  /\s+/g,
                  ""
                )}`;
                return (
                  <div key={name}>
                    <label
                      htmlFor={id}
                      className={classes.label}
                      style={required ? { fontWeight: "bold" } : undefined}
                    >
                      {`${name}${
                        required
                          ? " (required)"
                          : recommended
                          ? " (recommended)"
                          : ""
                      }`}
                    </label>
                    <div className={classes.inputContainer}>
                      <TextField
                        fullWidth
                        key={inputField.name}
                        id={id}
                        defaultValue={getRecordRes?.[name]}
                        error={requiredFields.includes(name)}
                      />
                    </div>
                    <Spacer direction="vertical" size="3vh" />
                  </div>
                );
              })}
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

export { Container as RecordEditModal };
export type { ContainerProps as RecordEditModalProps };
