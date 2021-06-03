import {
  DatabaseListItem,
  DatabaseListItemProps,
} from "components/organisms/DatabaseListItem";
import List from "@material-ui/core/List";

type Props = ContainerProps;

type ContainerProps = {
  databases: DatabaseListItemProps["database"][];
  onSelectDatabase: DatabaseListItemProps["onClick"];
};

const Component = ({ databases, onSelectDatabase }: Props): JSX.Element => {
  return (
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
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  return <Component {...delegated} />;
};

export { Container as DatabaseList };
export type { ContainerProps as DatabaseListProps };
