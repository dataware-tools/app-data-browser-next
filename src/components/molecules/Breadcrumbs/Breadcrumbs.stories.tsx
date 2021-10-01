import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Story } from "@storybook/react";
import { Breadcrumbs, BreadcrumbsProps } from ".";

export default {
  component: Breadcrumbs,
  title: "Breadcrumbs",
};

const Template: Story<BreadcrumbsProps> = (args) => <Breadcrumbs {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    { link: "#", text: "Home", icon: <HomeIcon /> },
    { link: "#", text: "Link without Icon" },
    { text: "Item without Link", icon: <WhatshotIcon /> },
    { text: "Current Page" },
  ],
};
