import { DatabaseListItemProps } from "components/organisms/DatabaseListItem";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import {
  extractReasonFromFetchError,
  ParamTypeListDatabases,
  useListDatabases,
} from "utils";
import {
  ErrorMessage,
  ErrorMessageProps,
  LoadingIndicator,
} from "@dataware-tools/app-common";
import { DataGrid, GridColumns, DataGridProps } from "@material-ui/data-grid";
import { useState, useEffect } from "react";

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
  } = useListDatabases(getAccessToken, { page, perPage, search });

  const fetchError = listDatabasesError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload this page",
      });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  const onSelectDatabase: Props["onSelectDatabase"] = (data) => {
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
