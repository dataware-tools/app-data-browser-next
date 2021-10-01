import { metaStore } from "@dataware-tools/app-common";
import StorageIcon from "@mui/icons-material/Storage";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

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
