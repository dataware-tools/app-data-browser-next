import { ErrorMessage, LoadingIndicator } from "@dataware-tools/app-common";
import Dialog from "@material-ui/core/Dialog";
import { DialogCloseButton } from "components/atoms/DialogCloseButton";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { DatabaseConfigType, useGetConfig, usePrevious } from "utils/index";
import {
  MetadataInputFieldList,
  MetadataInputFieldListProps,
} from "components/organisms/MetadataInputFieldList";
import { DialogContainer } from "components/atoms/DialogContainer";
import { DialogBody } from "components/atoms/DialogBody";
import { DialogToolBar } from "components/atoms/DialogToolBar";
import { DialogTitle } from "components/atoms/DialogTitle";
import { useAuth0 } from "@auth0/auth0-react";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  create?: boolean;
  data?: MetadataInputFieldListProps["data"];
  error: any;
  databaseId: string;
  onSubmit: (newRecordInfo: Record<string, unknown>) => Promise<boolean>;
};

const Container = ({
  open,
  onClose,
  create,
  data,
  error,
  databaseId,
  onSubmit,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [nonFilledRequiredsFields, setNonFilledRequireds] = useState<string[]>(
    []
  );

  const [getConfigRes, getConfigError] = (useGetConfig(getAccessToken, {
    databaseId,
  }) as unknown) as [
    data: DatabaseConfigType | undefined,
    error: any,
    cacheKey: string
  ];

  const record_input_config =
    getConfigRes?.data_browser_config?.record_input_config;
  const columns = getConfigRes?.columns;
  const inputFields =
    record_input_config && columns
      ? record_input_config.map((config) => ({
          ...config,
          display_name:
            columns.find((column) => column.name === config.name)
              ?.display_name || "",
        }))
      : null;

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

  const onSave = async () => {
    if (inputFields) {
      setIsSaving(true);
      const newRecordInfo = {};

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

      // @ts-expect-error this is necessary process
      if (!("path" in newRecordInfo)) newRecordInfo.path = "";

      // * onSubmit
      const isSubmitSucceed = await onSubmit(newRecordInfo);

      if (!isSubmitSucceed) {
        setIsSaving(false);
        window.alert("save failed. please retry saving");
        return;
      }

      setIsSaving(false);
    }
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogContainer>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>{create ? "Add" : "Edit"} Record</DialogTitle>
        {error || getConfigError ? (
          <ErrorMessage
            reason={JSON.stringify(error || getConfigError)}
            instruction="please reload this page"
          />
        ) : !inputFields || inputFields.length <= 0 ? (
          <ErrorMessage
            reason="Input fields is not configured"
            instruction="please report administrator this error"
          />
        ) : data || create ? (
          <>
            <DialogBody>
              <MetadataInputFieldList
                data={data}
                inputFields={inputFields}
                nonFilledRequiredFields={nonFilledRequiredsFields}
              />
            </DialogBody>
            <DialogToolBar
              right={
                <LoadingButton pending={isSaving} onClick={onSave}>
                  Save
                </LoadingButton>
              }
            />
          </>
        ) : (
          <LoadingIndicator />
        )}
      </DialogContainer>
    </Dialog>
  );
};

export { Container as MetadataEditModal };
export type { ContainerProps as MetadataEditModalProps };
