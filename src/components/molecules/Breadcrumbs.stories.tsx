import { Breadcrumbs } from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
  title: "Breadcrumbs",
};

export const Default = (): JSX.Element => {
  return (
    <Breadcrumbs
      items={[
        { link: "#", text: "Home", iconName: "Home" },
        { link: "#", text: "Link without Icon" },
        { text: "Item without Link", iconName: "Whatshot" },
        { text: "Current Page" },
      ]}
    />
  );
};
