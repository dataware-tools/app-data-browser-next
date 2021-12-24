import { Story } from "@storybook/react";
import { TextPreviewer, TextPreviewerProps } from "./TextPreviewer";

export default {
  component: TextPreviewer,
  title: "FilePreview/TextPreviewer",
};
const Template: Story<TextPreviewerProps> = (args) => (
  <TextPreviewer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  url: "https://raw.githubusercontent.com/dataware-tools/pydtk/master/README.md",
};
