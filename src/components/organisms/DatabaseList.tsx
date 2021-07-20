import { DatabaseListItemProps } from "components/organisms/DatabaseListItem";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { ParamTypeListDatabases, useListDatabases } from "utils";
import {
  ErrorMessage,
  ErrorMessageProps,
  LoadingIndicator,
  Table,
  TableProps,
} from "@dataware-tools/app-common";

type Props = {
  error?: ErrorMessageProps;
  columns: TableProps["columns"];
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
        <Table
          columns={columns}
          rows={databases}
          disableHoverCell
          stickyHeader
          onClickRow={(targetDetail) =>
            onSelectDatabase(targetDetail.row.database_id as string)
          }
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

  const columns = [
    {
      field: "name",
      ifEmpty: "No name...",
      label: "Name",
      type: "string" as const,
    },
    {
      field: "description",
      ifEmpty: "No description...",
      label: "Description",
      type: "string" as const,
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
