import { DatabaseListItemProps } from "components/organisms/DatabaseListItem";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { ParamTypeListDatabases, useListDatabases } from "utils";
import {
  confirm,
  ErrorMessage,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
  fetchMetaStore,
  LoadingIndicator,
  metaStore,
} from "@dataware-tools/app-common";
import {
  DataGrid,
  GridColumns,
  DataGridProps,
  GridCellParams,
} from "@material-ui/data-grid";
import { produce } from "immer";
import { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

type Props = {
  error?: ErrorMessageProps;
  columns: GridColumns;
  isFetchComplete: boolean;
  databases: DatabaseListItemProps["database"][];
  onSelectDatabase: DataGridProps["onCellClick"];
};

type ContainerProps = ParamTypeListDatabases;

const Component = ({
  error,
  columns,
  isFetchComplete,
  databases,
  onSelectDatabase,
}: Props): JSX.Element => {
  return (
    <>
      {error ? (
        <ErrorMessage {...error} />
      ) : isFetchComplete ? (
        <DataGrid
          columns={columns}
          rows={databases}
          onCellClick={onSelectDatabase}
          getRowId={(row) => row.database_id}
          hideFooter
          disableColumnMenu
        />
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

const Container = ({ page, perPage, search }: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const history = useHistory();
  const [error, setError] = useState<Props["error"] | undefined>(undefined);

  const {
    data: listDatabasesRes,
    error: listDatabasesError,
    mutate: listDatabaseMutate,
  } = useListDatabases(getAccessToken, { page, perPage, search });

  const fetchError = listDatabasesError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } = extractErrorMessageFromFetchError(
        fetchError
      );
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  const onDeleteDatabase = async (data: GridCellParams) => {
    if (listDatabasesRes) {
      if (
        !(await confirm({
          title: "Are you sure you want to delete database?",
          confirmMode: "delete",
        }))
      ) {
        return;
      }

      const newDatabaseList = produce(listDatabasesRes, (draft) => {
        draft.data.splice(
          draft.data.findIndex((d) => d.database_id === data.id),
          1
        );
      });
      listDatabaseMutate(newDatabaseList, false);

      const [deleteDatabaseRes, deleteDatabaseError] = await fetchMetaStore(
        getAccessToken,
        metaStore.DatabaseService.deleteDatabase,
        {
          databaseId: String(data.id),
        }
      );

      if (deleteDatabaseError) {
        const { reason, instruction } = extractErrorMessageFromFetchError(
          deleteDatabaseError
        );
        setError({ reason, instruction });
      } else if (deleteDatabaseRes) {
        listDatabaseMutate();
      }
    }
  };

  const DeleteButtonFieldName = "__DeleteButton__";
  const onSelectDatabase: Props["onSelectDatabase"] = (data) => {
    if (data.field === DeleteButtonFieldName) return;
    history.push(`/databases/${data.id}/records`);
  };

  const columns: GridColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      valueGetter: (param) => param.row.name || "No name...",
      sortable: false,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      valueGetter: (param) => param.row.description || "No description...",
      sortable: false,
    },
    {
      field: DeleteButtonFieldName,
      renderCell: (param) => (
        <IconButton onClick={() => onDeleteDatabase(param)}>
          <DeleteIcon />
        </IconButton>
      ),
      renderHeader: () => <div />,
      sortable: false,
    },
  ];
  const isFetchComplete = Boolean(!error && listDatabasesRes);
  const databases = listDatabasesRes?.data || [];

  return (
    <Component
      error={error}
      columns={columns}
      databases={databases}
      onSelectDatabase={onSelectDatabase}
      isFetchComplete={isFetchComplete}
    />
  );
};

export { Container as DatabaseList };
export type { ContainerProps as DatabaseListProps };
