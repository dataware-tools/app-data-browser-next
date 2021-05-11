import { databaseStore } from "@dataware-tools/app-common";
import { DatabaseListItem } from "components/organisms/DatabaseListItem";
import List from "@material-ui/core/List";

type Props = ContainerProps;

type ContainerProps = {
  databases: Required<databaseStore.DatabaseListModel>;
};

const Component = ({ databases }: Props): JSX.Element => {
  return (
    <List>
      {databases.databases.map((database) => (
        <DatabaseListItem key={database.database_id} database={database} />
      ))}
    </List>
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  return <Component {...delegated} />;
};

export { Container as DatabaseList };
export type { ContainerProps as DatabaseListProps };
