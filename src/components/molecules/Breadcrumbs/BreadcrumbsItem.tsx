import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router-dom";

type ComponentProps = {
  link?: string;
  icon?: JSX.Element;
  text: string;
};

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

const Component = ({ link, icon, text }: ComponentProps): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    if (link) history.push(link);
  }

  return link ? (
    <Link
      href="#"
      color="inherit"
      className={classes.link}
      onClick={handleClick}
    >
      {icon && <span className={classes.icon}>{icon}</span>}
      {text}
    </Link>
  ) : (
    <Typography color="textPrimary" className={classes.link}>
      {icon && <span className={classes.icon}>{icon}</span>}
      {text}
    </Typography>
  );
};

export { Component as BreadcrumbsItem };
export type { ComponentProps as BreadcrumbsItemProps };
