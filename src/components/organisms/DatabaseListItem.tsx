import { metaStore } from "@dataware-tools/app-common";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import StorageIcon from "@material-ui/icons/Storage";
import ListItemText from "@material-ui/core/ListItemText";
import { useRouter } from "next/dist/client/router";

type Props = { onClick: () => void } & ContainerProps;

type ContainerProps = {
  database: metaStore.DatabaseModel;
};

const Component = ({ database, onClick }: Props): JSX.Element => {
  return (
    <ListItem button onClick={onClick}>
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
  const router = useRouter();
  const onClick = () => {
    router.push(`/databases/${database.database_id}/records`);
  };
  return <Component onClick={onClick} database={database} {...delegated} />;
};

export { Container as DatabaseListItem };
export type { ContainerProps as DatabaseListItemProps };
