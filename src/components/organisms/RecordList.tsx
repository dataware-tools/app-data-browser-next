import { useAuth0 } from "@auth0/auth0-react";
import {
  confirm,
  ErrorMessage,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
  metaStore,
} from "@dataware-tools/app-common";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  DataGridProps,
  GridCellParams,
  GridColumns,
} from "@mui/x-data-grid";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { RecordDetailModal } from "components/organisms/RecordDetailModal";
import { useIsActionPermitted, recordPaginateState } from "globalStates";
import {
  useGetConfig,
  fetchMetaStore,
  useListRecords,
  ParamTypeListRecords,
} from "utils";

export type RecordListPresentationProps = {
  error?: ErrorMessageProps;
  columns: GridColumns;
  selectedRecordId?: string;
  onCloseRecordDetailModal: () => void;
  records: metaStore.RecordModel[];
  onSelectRecord: DataGridProps["onCellClick"];
  onSortModelChange: DataGridProps["onSortModelChange"];
} & Pick<RecordListProps, "databaseId">;

export type RecordListProps = ParamTypeListRecords;

export const RecordListPresentation = ({
  error,
  records,
  onSelectRecord,
  columns,
  databaseId,
  selectedRecordId,
  onCloseRecordDetailModal,
  onSortModelChange,
}: RecordListPresentationProps): JSX.Element => {
  return (
    <>
      {error ? (
        <ErrorMessage {...error} />
      ) : (
        <>
          <DataGrid
            rows={records}
            columns={columns}
            onCellClick={onSelectRecord}
            getRowId={(row) => row.record_id}
            onSortModelChange={onSortModelChange}
            hideFooter
            disableColumnMenu
            sortingMode="server"
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

export const RecordList = ({
  databaseId,
  page,
  perPage,
  search,
  searchKey,
  ...delegated
}: RecordListProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const isPermittedDeleteRecord = useIsActionPermitted("metadata:write:delete");
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<
    RecordListPresentationProps["error"] | undefined
  >(undefined);
  const [{ sortKey, sortOrder }, setRecordPaginateState] = useRecoilState(
    recordPaginateState
  );

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
    sortKey,
    sortOrder,
  });

  const onDeleteRecord = async (record: GridCellParams) => {
    if (listRecordsRes) {
      if (
        !(await confirm({
          title: "Are you sure you want to delete record?",
          confirmMode: "delete",
        }))
      ) {
        return;
      }

      const newRecordList = produce(listRecordsRes, (draft) => {
        draft.data.splice(
          draft.data.findIndex((d) => d.record_id === record.id),
          1
        );
      });
      listRecordsMutate(newRecordList, false);

      const [deleteRecordRes, deleteRecordError] = await fetchMetaStore(
        getAccessToken,
        metaStore.RecordService.deleteRecord,
        {
          databaseId,
          recordId: String(record.id),
        }
      );

      if (deleteRecordError) {
        const { reason, instruction } = extractErrorMessageFromFetchError(
          deleteRecordError
        );
        setError({ reason, instruction });
      } else if (deleteRecordRes) {
        listRecordsMutate();
      }
    }
  };

  const onSortModelChange: RecordListPresentationProps["onSortModelChange"] = (
    model
  ) => {
    if (model.length > 0) {
      const sortModel = model[0];
      setRecordPaginateState((prev) => ({
        ...prev,
        sortKey: sortModel.field,
        sortOrder:
          sortModel.sort === "asc" ? 1 : sortModel.sort === "desc" ? -1 : 1,
      }));
    } else {
      setRecordPaginateState((prev) => ({
        ...prev,
        sortKey: "record_id",
        sortOrder: 1,
      }));
    }
  };
  const DeleteButtonFieldName = "__DeleteButton__";
  const columns: RecordListPresentationProps["columns"] =
    getConfigRes?.columns
      .filter((column) => column.is_display_field)
      .map((column) => ({
        field: column.name,
        headerName: column.display_name,
        flex: 1,
      })) || [];
  if (isPermittedDeleteRecord) {
    columns.push({
      field: DeleteButtonFieldName,
      renderCell: (param) => (
        <IconButton onClick={() => onDeleteRecord(param)}>
          <DeleteIcon />
        </IconButton>
      ),
      renderHeader: () => <div />,
      sortable: false,
    });
  }

  const fetchError = listRecordsError || getConfigError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } = extractErrorMessageFromFetchError(
        fetchError
      );
      setError({ reason, instruction });
    } else if (columns.length <= 0) {
      setError({
        reason: "Display columns is not configured",
        instruction: "Please report administrator this error",
      });
    } else {
      setError(undefined);
    }
  }, [fetchError, columns.length]);

  const onSelectRecord: RecordListPresentationProps["onSelectRecord"] = (
    record
  ) => {
    if (record.field === DeleteButtonFieldName) {
      return;
    }
    if (listRecordsRes) {
      setSelectedRecordId(String(record.id));
    }
  };

  const onCloseRecordDetailModal = () => {
    setSelectedRecordId(undefined);
    listRecordsMutate();
  };

  const records = listRecordsRes?.data || [];

  return (
    <RecordListPresentation
      {...delegated}
      error={error}
      columns={columns}
      records={records}
      databaseId={databaseId}
      onCloseRecordDetailModal={onCloseRecordDetailModal}
      onSelectRecord={onSelectRecord}
      onSortModelChange={onSortModelChange}
      selectedRecordId={selectedRecordId}
    />
  );
};
