import { metaStore } from "@dataware-tools/app-common";
import { DatabaseListItem } from "components/organisms/DatabaseListItem";
import List from "@material-ui/core/List";

type Props = ContainerProps;

type ContainerProps = {
  databases: metaStore.DatabaseModel[];
};

const Component = ({ databases }: Props): JSX.Element => {
  return (
    <List>
      {databases.map((database) => {
        return (
          <DatabaseListItem key={database.database_id} database={database} />
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
