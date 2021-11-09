import MuiBreadcrumbs from "@mui/material/Breadcrumbs";

import { BreadcrumbsItem, BreadcrumbsItemProps } from "./BreadcrumbsItem";

export type BreadcrumbsProps = {
  items: BreadcrumbsItemProps[];
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps): JSX.Element => {
  const breadcrumbItems: JSX.Element[] = items.map(
    (itemProps: BreadcrumbsItemProps, index: number) => (
      <BreadcrumbsItem key={index} {...itemProps} />
    )
  );

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">{breadcrumbItems}</MuiBreadcrumbs>
  );
};
