import { metaStore } from "@dataware-tools/app-common";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StorageIcon from "@material-ui/icons/Storage";

export type DatabaseType = metaStore.DatabaseModel;

export type DatabaseListItemProps = {
  database: DatabaseType;
  onClick: (database: DatabaseType) => void;
};

export const DatabaseListItem = ({
  database,
  onClick,
}: DatabaseListItemProps): JSX.Element => {
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
