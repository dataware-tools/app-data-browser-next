import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import * as MuiIcons from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
    },
    icon: {
      marginRight: theme.spacing(1),
      width: 20,
      height: 20,
    },
  })
);

type ItemType = {
  link?: string;
  iconName?: string;
  text: string;
};

type BreadcrumbsItemProps = {
  item: ItemType;
};

const BreadcrumbsItem = ({ item }: BreadcrumbsItemProps): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    if (item.link) history.push(item.link);
  }

  return item.link ? (
    <Link
      href="#"
      color="inherit"
      className={classes.link}
      onClick={handleClick}
    >
      {item.iconName && (
        <span className={classes.icon}>
          {React.createElement(MuiIcons[item.iconName])}
        </span>
      )}
      {item.text}
    </Link>
  ) : (
    <Typography color="textPrimary" className={classes.link}>
      {item.iconName && (
        <span className={classes.icon}>
          {React.createElement(MuiIcons[item.iconName])}
        </span>
      )}
      {item.text}
    </Typography>
  );
};

type ComponentProps = {
  items: ItemType[];
};

const Component = ({ items }: ComponentProps): JSX.Element => {
  const breadcrumbItems: JSX.Element[] = items.map(
    (item: ItemType, index: number) => (
      <BreadcrumbsItem item={item} key={index} />
    )
  );

  return <Breadcrumbs aria-label="breadcrumb">{breadcrumbItems}</Breadcrumbs>;
};

export { Component as Breadcrumbs };
