import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import * as MuiIcons from "@material-ui/icons";

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

type Props = {
  items: ItemType[];
};

const Component = ({ items }: Props): JSX.Element => {
  const classes = useStyles();

  const breadcrumbItems: JSX.Element[] = items.map(
    (item: ItemType, index: number) => {
      return item.link ? (
        <Link
          color="inherit"
          href={item.link}
          key={index}
          className={classes.link}
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
    }
  );

  return <Breadcrumbs aria-label="breadcrumb">{breadcrumbItems}</Breadcrumbs>;
};

export { Component as Breadcrumbs };
