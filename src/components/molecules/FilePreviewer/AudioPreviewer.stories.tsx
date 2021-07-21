import { AudioPreviewer } from "./AudioPreviewer";

export default {
  component: AudioPreviewer,
  title: "FilePreview/Audio",
};

export const Audio = () => (
  <AudioPreviewer url="https://wavesurfer-js.org/example/media/demo.wav" />
);
