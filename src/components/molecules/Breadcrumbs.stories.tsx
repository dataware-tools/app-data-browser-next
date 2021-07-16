import { Breadcrumbs } from "./Breadcrumbs";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";

export default {
  component: Breadcrumbs,
  title: "Breadcrumbs",
};

export const Default = (): JSX.Element => {
  return (
    <Breadcrumbs
      items={[
        { link: "#", text: "Home", icon: <HomeIcon /> },
        { link: "#", text: "Link without Icon" },
        { text: "Item without Link", icon: <WhatshotIcon /> },
        { text: "Current Page" },
      ]}
    />
  );
};
