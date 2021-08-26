import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import React from "react";

import { BreadcrumbsItem, BreadcrumbsItemProps } from "./BreadcrumbsItem";

type ComponentProps = {
  items: BreadcrumbsItemProps[];
};

const Component = ({ items }: ComponentProps): JSX.Element => {
  const breadcrumbItems: JSX.Element[] = items.map(
    (itemProps: BreadcrumbsItemProps, index: number) => (
      <BreadcrumbsItem key={index} {...itemProps} />
    )
  );

  return <Breadcrumbs aria-label="breadcrumb">{breadcrumbItems}</Breadcrumbs>;
};

export { Component as Breadcrumbs };
export type { ComponentProps as BreadcrumbsProps };
