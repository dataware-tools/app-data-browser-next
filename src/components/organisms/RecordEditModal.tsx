import { ErrorMessageProps, metaStore } from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useMemo, useState } from "react";
import {
  MetadataEditModal,
  MetadataEditModalProps,
} from "components/organisms/MetadataEditModal";
import {
  fetchMetaStore,
  useGetRecord,
  DatabaseConfigType,
  useGetConfig,
  pydtkSystemColumns,
} from "utils";

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
  ...delegated
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

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
            !column.name.startsWith("_")
        )
        .map((column) => ({
          name: column.name,
          display_name: column.display_name,
          necessity: column.necessity || "unnecessary",
        })) || [],
    [getConfigRes]
  );

  useEffect(() => {
    if (fields.length <= 0) {
      setError({
        reason: "Input fields is not configured",
        instruction: "please report administrator this error",
      });
    }
  }, [fields]);

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
