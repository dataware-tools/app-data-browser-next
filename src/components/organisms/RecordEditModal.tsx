import { ErrorMessageProps, metaStore } from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  compInputFields,
  fetchMetaStore,
  useGetRecord,
  useGetConfig,
  useListRecords,
  editableColumnDtype,
  isEditableColumnName,
  extractReasonFromFetchError,
} from "utils";
import {
  MetadataEditModal,
  MetadataEditModalProps,
} from "components/organisms/MetadataEditModal";
import { recordPaginateState } from "globalStates";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  recordId?: string;
  databaseId: string;
  onSubmitSucceeded?: (newRecord: metaStore.RecordModel) => void;
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
  const recordPaginateValue = useRecoilValue(recordPaginateState);

  const {
    data: listRecordsRes,
    mutate: listRecordsMutate,
  } = useListRecords(getAccessToken, { databaseId, ...recordPaginateValue });
  const {
    data: getRecordRes,
    error: getRecordError,
    mutate: getRecordMutate,
  } = useGetRecord(getAccessToken, {
    databaseId,
    recordId,
  });

  const { data: getConfigRes, error: getConfigError } = useGetConfig(
    getAccessToken,
    {
      databaseId,
    }
  );

  const fields: MetadataEditModalProps["fields"] = useMemo(
    () =>
      getConfigRes?.columns
        .filter((column) =>
          Boolean(
            isEditableColumnName(getConfigRes, column.name) &&
              editableColumnDtype.includes(column.dtype) &&
              (create ? column.necessity !== "unnecessary" : true)
          )
        )
        .map((column) => ({
          name: column.name,
          display_name: column.display_name,
          necessity: column.necessity || "unnecessary",
          order_of_input: column.order_of_input,
        }))
        .sort(compInputFields) || [],
    [getConfigRes, create]
  );
  const fetchError = getRecordError || getConfigError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload this page",
      });
    } else if (create && fields.length <= 0) {
      setError({
        reason: "Input fields is not configured",
        instruction: "please report administrator this error",
      });
    } else {
      setError(undefined);
    }
  }, [fetchError, fields, create]);

  const onSubmit: MetadataEditModalProps["onSubmit"] = async (
    newRecordInfo
  ) => {
    const [saveRecordRes, saveRecordError] = create
      ? await fetchMetaStore(
          getAccessToken,
          metaStore.RecordService.createRecord,
          {
            databaseId,
            requestBody: { ...newRecordInfo, path: "" },
          }
        )
      : await fetchMetaStore(
          getAccessToken,
          metaStore.RecordService.updateRecord,
          {
            recordId: recordId as NonNullable<typeof recordId>,
            databaseId,
            requestBody: newRecordInfo,
          }
        );

    if (saveRecordError) {
      setError({
        reason: JSON.stringify(saveRecordError),
        instruction: "Please reload thi page",
      });
      return false;
    }

    if (saveRecordRes && listRecordsRes) {
      getRecordMutate(saveRecordRes);
      if (create) {
        listRecordsMutate({
          ...listRecordsRes,
          data: [saveRecordRes, ...listRecordsRes?.data],
        });
      } else {
        listRecordsMutate({
          ...listRecordsRes,
          data: listRecordsRes?.data.map((record) =>
            record.record_id === saveRecordRes.record_id
              ? saveRecordRes
              : record
          ),
        });
      }
      onSubmitSucceeded && saveRecordRes && onSubmitSucceeded(saveRecordRes);
    }

    return true;
  };

  const title = create ? "Add record" : "Edit record";
  return (
    <MetadataEditModal
      open={open}
      title={title}
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
