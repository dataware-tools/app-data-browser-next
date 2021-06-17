import {
  DialogBody,
  DialogCloseButton,
  DialogContainer,
  DialogMain,
  DialogTitle,
  DialogToolBar,
  DialogWrapper,
  metaStore,
  fetchMetaStore,
  ErrorMessageProps,
  ErrorMessage,
} from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { usePrevious } from "utils";

type Props = {
  databaseId: string;
  name: string;
  description: string;
  onChangeDatabaseId: TextFieldProps["onChange"];
  onChangeName: TextFieldProps["onChange"];
  onChangeDescriptions: TextFieldProps["onChange"];
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  error?: ErrorMessageProps;
} & Omit<ContainerProps, "onSubmitSucceeded">;

type ContainerProps = {
  onClose: () => void;
  onSubmitSucceeded: (newDatabase: metaStore.DatabaseModel) => void;
} & Omit<DialogProps, "onClose" | "onSubmit">;

const Component = ({
  databaseId,
  name,
  description,
  onChangeDatabaseId,
  onChangeName,
  onChangeDescriptions,
  onClose,
  error,
  onSubmit,
  isSubmitting,
  ...delegated
}: Props) => {
  return (
    <Dialog {...delegated}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>Add Record</DialogTitle>
        {error ? (
          <ErrorMessage {...error} />
        ) : (
          <DialogContainer>
            <DialogBody>
              <DialogMain>
                <label htmlFor="DatabaseAddModal_databaseId">
                  Database ID
                  <TextField
                    fullWidth
                    id="DatabaseAddModal_databaseId"
                    value={databaseId}
                    onChange={onChangeDatabaseId}
                  />
                </label>
                <label htmlFor="DatabaseAddModal_name">
                  Name
                  <TextField
                    fullWidth
                    id="DatabaseAddModal_name"
                    value={name}
                    onChange={onChangeName}
                  />
                </label>
                <label htmlFor="DatabaseAddModal_description">
                  Description
                  <TextField
                    fullWidth
                    id="DatabaseAddModal_description"
                    value={description}
                    onChange={onChangeDescriptions}
                  />
                </label>
              </DialogMain>
              <DialogToolBar
                right={
                  <LoadingButton pending={isSubmitting} onClick={onSubmit}>
                    Save
                  </LoadingButton>
                }
              />
            </DialogBody>
          </DialogContainer>
        )}
      </DialogWrapper>
    </Dialog>
  );
};

const Container = ({
  onSubmitSucceeded,
  open,
  onClose,
  ...delegated
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();

  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [databaseId, setDatabaseId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const initializeState = () => {
    setError(undefined);
    setIsSubmitting(false);
    setDatabaseId("");
    setName("");
    setDescription("");
  };

  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);

  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onChangeDatabaseId: Props["onChangeDatabaseId"] = (event) => {
    setDatabaseId(event.target.value);
  };
  const onChangeName: Props["onChangeName"] = (event) => {
    setName(event.target.value);
  };
  const onChangeDescription: Props["onChangeDescriptions"] = (event) => {
    setDescription(event.target.value);
  };

  const onSubmit: Props["onSubmit"] = async () => {
    setIsSubmitting(true);

    const [createDatabaseRes, createDatabaseError] = await fetchMetaStore(
      getAccessToken,
      metaStore.DatabaseService.createDatabase,
      {
        requestBody: { database_id: databaseId, name, description },
      }
    );
    if (createDatabaseError) {
      setError({
        reason: JSON.stringify(createDatabaseError),
        instruction: "Please reload this page",
      });
      return;
    } else if (createDatabaseRes) {
      onSubmitSucceeded(createDatabaseRes);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Component
      open={open}
      onClose={onClose}
      databaseId={databaseId}
      name={name}
      description={description}
      onChangeDatabaseId={onChangeDatabaseId}
      onChangeName={onChangeName}
      onChangeDescriptions={onChangeDescription}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error}
      {...delegated}
    />
  );
};

export { Container as DatabaseAddModal };
export type { ContainerProps as DatabaseAddModalProps };
