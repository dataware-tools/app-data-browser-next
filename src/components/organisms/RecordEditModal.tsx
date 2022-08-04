import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  MetadataEditModal,
  MetadataEditModalProps,
} from "components/organisms/MetadataEditModal";
import { recordPaginateState } from "globalStates";
import {
  compInputFields,
  enqueueErrorToastForFetchError,
  fetchMetaStore,
  useGetRecord,
  useGetConfig,
  useListRecords,
  editableColumnDtype,
  isEditableColumnName,
} from "utils";

export type RecordEditModalProps = {
  open: boolean;
  onClose: () => void;
  recordId?: string;
  databaseId: string;
  onSubmitSucceeded?: (newRecord: metaStore.RecordModel) => void;
  create?: boolean;
};

export const RecordEditModal = ({
  recordId,
  databaseId,
  onSubmitSucceeded,
  create,
  open,
  ...delegated
}: RecordEditModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const recordPaginateValue = useRecoilValue(recordPaginateState);

  const { data: listRecordsRes, mutate: listRecordsMutate } = useListRecords(
    getAccessToken,
    { databaseId, ...recordPaginateValue }
  );
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

  const fields = useMemo(
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
          necessity: column.necessity || "unnecessary",
          ...column,
        }))
        .sort(compInputFields) || [],
    [getConfigRes, create]
  );
  const fetchError = getRecordError || getConfigError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } =
        extractErrorMessageFromFetchError(fetchError);
      setError({ reason, instruction });
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
      enqueueErrorToastForFetchError("Failed to save record", saveRecordError);
      return false;
    }

    if (saveRecordRes && listRecordsRes) {
      getRecordMutate(saveRecordRes);
      if (create) {
        listRecordsMutate({
          ...listRecordsRes,
          data: [saveRecordRes, ...(listRecordsRes?.data ?? [])],
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
