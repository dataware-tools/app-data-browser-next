import { metaStore } from "@dataware-tools/app-common";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StorageIcon from "@material-ui/icons/Storage";

type DatabaseType = metaStore.DatabaseModel;
type Props = ContainerProps;

type ContainerProps = {
  database: DatabaseType;
  onClick: (database: DatabaseType) => void;
};

const Component = ({ database, onClick }: Props): JSX.Element => {
  return (
    <ListItem button onClick={() => onClick(database)}>
      <ListItemIcon>
        <StorageIcon />
      </ListItemIcon>
      <ListItemText
        primary={database.name ? database.name : "No name"}
        secondary={
          database.description ? database.description : "No description..."
        }
      />
    </ListItem>
  );
};

const Container = ({ database, ...delegated }: ContainerProps): JSX.Element => {
  return <Component database={database} {...delegated} />;
};

export { Container as DatabaseListItem };
export type { ContainerProps as DatabaseListItemProps, DatabaseType };
