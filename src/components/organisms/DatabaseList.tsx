import { DatabaseListItemProps } from "components/organisms/DatabaseListItem";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { ParamTypeListDatabases, useListDatabases } from "utils";
import {
  ErrorMessage,
  ErrorMessageProps,
  LoadingIndicator,
} from "@dataware-tools/app-common";
import { DataGrid, GridColumns } from "@material-ui/data-grid";

type Props = {
  error?: ErrorMessageProps;
  columns: GridColumns;
  isFetchComplete: boolean;
  databases: DatabaseListItemProps["database"][];
  onSelectDatabase: (databaseId: string) => void;
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
          onRowClick={(params) => onSelectDatabase(params.row.database_id)}
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

  const {
    data: listDatabasesRes,
    error: listDatabasesError,
  } = useListDatabases(getAccessToken, { page, perPage, search });

  const onSelectDatabase = (databaseId: string) =>
    history.push(`/databases/${databaseId}/records`);

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
      valueGetter: (param) => param.row.name || "No description...",
      sortable: false,
    },
  ];
  const error: Props["error"] = listDatabasesError
    ? {
        reason: JSON.stringify(listDatabasesError),
        instruction: "Please reload this page",
      }
    : undefined;
  const isFetchComplete = Boolean(!error && listDatabasesRes);
  const databases = listDatabasesRes?.data || [];
  return (
    <Component
      columns={columns}
      databases={databases}
      onSelectDatabase={onSelectDatabase}
      isFetchComplete={isFetchComplete}
    />
  );
};

export { Container as DatabaseList };
export type { ContainerProps as DatabaseListProps };
