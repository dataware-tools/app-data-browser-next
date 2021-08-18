import { sleep } from "@dataware-tools/app-common";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Story } from "@storybook/react";
import { FileMenuItem, FileMenuItemProps } from "./FileMenuItem";

export default {
  component: FileMenuItem,
  title: "FileMenuItem",
};

const Template: Story<FileMenuItemProps> = (args) => <FileMenuItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: <AddCircleIcon />,
  text: "test",
  onClick: async () => await sleep(1000),
};
