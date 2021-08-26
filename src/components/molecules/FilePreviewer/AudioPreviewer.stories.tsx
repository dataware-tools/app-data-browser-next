import { Story } from "@storybook/react";
import { AudioPreviewer, AudioPreviewerProps } from "./AudioPreviewer";
import { CONST_STORY_BOOK } from "test-utils";

export default {
  component: AudioPreviewer,
  title: "FilePreview/AudioPreviewer",
};
const Template: Story<AudioPreviewerProps> = (args) => (
  <AudioPreviewer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  url: "https://wavesurfer-js.org/example/media/demo.wav",
};
Default.parameters = { ...CONST_STORY_BOOK.PARAM_SKIP_VISUAL_REGRESSION_TEST };
