import {
  DatabaseListItem,
  DatabaseListItemProps,
} from "components/organisms/DatabaseListItem";
import List from "@material-ui/core/List";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { ParamTypeListDatabases, useListDatabases } from "utils";
import {
  ErrorMessage,
  ErrorMessageProps,
  LoadingIndicator,
  metaStore,
} from "@dataware-tools/app-common";

type Props = {
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  databases: DatabaseListItemProps["database"][];
  onSelectDatabase: DatabaseListItemProps["onClick"];
};

type ContainerProps = ParamTypeListDatabases;

const Component = ({
  error,
  isFetchComplete,
  databases,
  onSelectDatabase,
}: Props): JSX.Element => {
  return (
    <>
      {error ? (
        <ErrorMessage {...error} />
      ) : isFetchComplete ? (
        <List>
          {databases.map((database) => {
            return (
              <DatabaseListItem
                key={database.database_id}
                database={database}
                onClick={onSelectDatabase}
              />
            );
          })}
        </List>
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

  const onSelectDatabase = (database: metaStore.DatabaseModel) =>
    history.push(`/databases/${database.database_id}/records`);

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
      databases={databases}
      onSelectDatabase={onSelectDatabase}
      isFetchComplete={isFetchComplete}
    />
  );
};

export { Container as DatabaseList };
export type { ContainerProps as DatabaseListProps };
