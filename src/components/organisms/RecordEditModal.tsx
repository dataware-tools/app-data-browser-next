import {
  ErrorMessageProps,
  metaStore,
  usePrevious,
} from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useMemo, useState } from "react";
import {
  compInputFields,
  fetchMetaStore,
  useGetRecord,
  DatabaseConfigType,
  useGetConfig,
  pydtkSystemColumns,
} from "utils/index";
import {
  MetadataEditModal,
  MetadataEditModalProps,
} from "components/organisms/MetadataEditModal";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  recordId?: string;
  databaseId: string;
  onSubmitSucceeded: (newRecord: metaStore.RecordModel) => void;
  create?: boolean;
};

const Container = ({
  recordId,
  databaseId,
  onSubmitSucceeded,
  create,
  open,
  ...delegated
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

  const initializeState = () => {
    setError(undefined);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const [getRecordRes, getRecordError] = useGetRecord(getAccessToken, {
    databaseId,
    recordId,
  });

  const [getConfigRes, getConfigError] = (useGetConfig(getAccessToken, {
    databaseId,
  }) as unknown) as [
    data: DatabaseConfigType | undefined,
    error: any,
    cacheKey: string
  ];

  const fetchError = getRecordError || getConfigError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: JSON.stringify(fetchError),
        instruction: "Please reload this page",
      });
    }
  }, [fetchError]);

  const fields: MetadataEditModalProps["fields"] = useMemo(
    () =>
      getConfigRes?.columns
        .filter(
          (column) =>
            !pydtkSystemColumns.includes(column.name) &&
            !column.name.startsWith("_") &&
            (create ? column.necessity !== "unnecessary" : true)
        )
        .map((column) => ({
          name: column.name,
          display_name: column.display_name,
          necessity: column.necessity || "unnecessary",
        }))
        .sort(compInputFields) || [],
    [getConfigRes, create]
  );

  useEffect(() => {
    if (create && fields.length <= 0) {
      setError({
        reason: "Input fields is not configured",
        instruction: "please report administrator this error",
      });
    }
  }, [fields, create, open]);

  const onSubmit: MetadataEditModalProps["onSubmit"] = async (
    newRecordInfo
  ) => {
    if (create) {
      newRecordInfo.path = "";
      const [saveRecordRes] = await fetchMetaStore(
        getAccessToken,
        metaStore.RecordService.createRecord,
        {
          databaseId,
          requestBody: newRecordInfo,
        }
      );
      if (saveRecordRes) onSubmitSucceeded(saveRecordRes);
      return Boolean(saveRecordRes);
    } else {
      if (recordId) {
        const [saveRecordRes] = await fetchMetaStore(
          getAccessToken,
          metaStore.RecordService.updateRecord,
          {
            recordId,
            databaseId,
            requestBody: newRecordInfo,
          }
        );

        if (saveRecordRes) onSubmitSucceeded(saveRecordRes);
        return Boolean(saveRecordRes);
      }
      return false;
    }
  };

  return (
    <MetadataEditModal
      open={open}
      currentMetadata={getRecordRes}
      fields={fields}
      error={error}
      onSubmit={onSubmit}
      create={create}
      {...delegated}
    />
  );
};

export { Container as RecordEditModal };
export type { ContainerProps as RecordEditModalProps };
