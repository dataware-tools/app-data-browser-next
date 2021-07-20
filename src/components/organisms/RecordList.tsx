import {
  confirm,
  ErrorMessage,
  ErrorMessageProps,
  metaStore,
  Table,
  TableProps,
} from "@dataware-tools/app-common";
import { RecordDetailModal } from "components/organisms/RecordDetailModal";
import { useIsActionPermitted } from "globalStates";
import {
  useGetConfig,
  fetchMetaStore,
  useListRecords,
  ParamTypeListRecords,
  extractReasonFromFetchError,
} from "utils";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { produce } from "immer";

type Props = {
  error?: ErrorMessageProps;
  columns: TableProps["columns"];
  selectedRecordId?: string;
  onCloseRecordDetailModal: () => void;
  records: metaStore.RecordModel[];
  onSelectRecord: TableProps["onClickRow"];
  onDeleteRecord: TableProps["onDeleteRow"];
} & Pick<ContainerProps, "databaseId">;

type ContainerProps = ParamTypeListRecords;

const Component = ({
  error,
  records,
  onSelectRecord,
  onDeleteRecord,
  columns,
  databaseId,
  selectedRecordId,
  onCloseRecordDetailModal,
}: Props): JSX.Element => {
  return (
    <>
      {error ? (
        <ErrorMessage {...error} />
      ) : (
        <>
          <Table
            rows={records}
            columns={columns}
            onClickRow={onSelectRecord}
            onDeleteRow={onDeleteRecord}
            stickyHeader
            disableHoverCell
          />
          {selectedRecordId ? (
            <RecordDetailModal
              open={Boolean(selectedRecordId)}
              recordId={selectedRecordId}
              databaseId={databaseId}
              onClose={onCloseRecordDetailModal}
            />
          ) : null}
        </>
      )}
    </>
  );
};

const Container = ({
  databaseId,
  page,
  perPage,
  search,
  searchKey,
  ...delegated
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const isPermittedDeleteRecord = useIsActionPermitted("metadata:write:delete");
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<Props["error"] | undefined>(undefined);

  const { data: getConfigRes, error: getConfigError } = useGetConfig(
    getAccessToken,
    {
      databaseId,
    }
  );

  const {
    data: listRecordsRes,
    error: listRecordsError,
    mutate: listRecordsMutate,
  } = useListRecords(getAccessToken, {
    databaseId,
    page,
    perPage,
    search,
    searchKey,
  });

  const columns =
    getConfigRes?.columns
      .filter((column) => column.is_display_field)
      .map((column) => ({
        field: column.name,
        label: column.display_name,
      })) || [];
  const fetchError = listRecordsError || getConfigError;

  useEffect(() => {
    if (fetchError) {
      setError({
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload this page",
      });
    } else if (columns.length <= 0) {
      setError({
        reason: "Display columns is not configured",
        instruction: "Please report administrator this error",
      });
    } else {
      setError(undefined);
    }
  }, [fetchError, columns.length]);

  const onSelectRecord: Props["onSelectRecord"] = (record) => {
    if (listRecordsRes) {
      setSelectedRecordId(listRecordsRes.data[record.index].record_id);
    }
  };

  const onDeleteRecord: Props["onDeleteRecord"] = async (record) => {
    if (listRecordsRes) {
      if (
        !(await confirm({ title: "Are you sure you want to delete record?" }))
      ) {
        return;
      }

      const newRecordList = produce(listRecordsRes, (draft) => {
        draft.data.splice(record.index, 1);
      });
      listRecordsMutate(newRecordList, false);

      const [deleteRecordRes, deleteRecordError] = await fetchMetaStore(
        getAccessToken,
        metaStore.RecordService.deleteRecord,
        {
          databaseId,
          recordId: listRecordsRes.data[record.index].record_id,
        }
      );

      if (deleteRecordError) {
        setError({
          reason: extractReasonFromFetchError(deleteRecordError),
          instruction: "Please reload this page",
        });
      } else if (deleteRecordRes) {
        listRecordsMutate();
      }
    }
  };

  const onCloseRecordDetailModal = () => {
    setSelectedRecordId(undefined);
    listRecordsMutate();
  };

  const records = listRecordsRes?.data || [];

  return (
    <Component
      {...delegated}
      error={error}
      columns={columns}
      records={records}
      databaseId={databaseId}
      onCloseRecordDetailModal={onCloseRecordDetailModal}
      onDeleteRecord={isPermittedDeleteRecord ? onDeleteRecord : undefined}
      onSelectRecord={onSelectRecord}
      selectedRecordId={selectedRecordId}
    />
  );
};

export { Container as RecordList };
export type { ContainerProps as RecordListProps };
