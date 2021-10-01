import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
  LoadingIndicator,
} from "@dataware-tools/app-common";
import { DataGrid, GridColumns, DataGridProps } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DatabaseListItemProps } from "components/organisms/DatabaseListItem";
import { ParamTypeListDatabases, useListDatabases } from "utils";

export type DatabaseListPresentationProps = {
  error?: ErrorMessageProps;
  columns: GridColumns;
  isFetchComplete: boolean;
  databases: DatabaseListItemProps["database"][];
  onSelectDatabase: DataGridProps["onCellClick"];
};

export type DatabaseListProps = ParamTypeListDatabases;

export const DatabaseListPresentation = ({
  error,
  columns,
  isFetchComplete,
  databases,
  onSelectDatabase,
}: DatabaseListPresentationProps): JSX.Element => {
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

export const DatabaseList = ({
  page,
  perPage,
  search,
}: DatabaseListProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const history = useHistory();
  const [error, setError] = useState<
    DatabaseListPresentationProps["error"] | undefined
  >(undefined);

  const {
    data: listDatabasesRes,
    error: listDatabasesError,
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

  const onSelectDatabase: DatabaseListPresentationProps["onSelectDatabase"] = (
    data
  ) => {
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
  ];
  const isFetchComplete = Boolean(!error && listDatabasesRes);
  const databases = listDatabasesRes?.data || [];

  return (
    <DatabaseListPresentation
      error={error}
      columns={columns}
      databases={databases}
      onSelectDatabase={onSelectDatabase}
      isFetchComplete={isFetchComplete}
    />
  );
};
