import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useHistory } from "react-router-dom";

export type BreadcrumbsItemProps = {
  link?: string;
  icon?: JSX.Element;
  text: string;
};

export const BreadcrumbsItem = ({
  link,
  icon,
  text,
}: BreadcrumbsItemProps): JSX.Element => {
  const history = useHistory();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (link) history.push(link);
  };

  const Body = ({ icon, text }: { icon?: JSX.Element; text: string }) => (
    <Box component="span" sx={{ display: "flex" }}>
      {icon && (
        <Box component="span" sx={{ marginRight: 1, width: 20, height: 20 }}>
          {icon}
        </Box>
      )}
      {text}
    </Box>
  );

  return link ? (
    <Link href="#" color="inherit" onClick={handleClick}>
      <Body icon={icon} text={text} />
    </Link>
  ) : (
    <Typography color="textPrimary">
      <Body icon={icon} text={text} />
    </Typography>
  );
};
