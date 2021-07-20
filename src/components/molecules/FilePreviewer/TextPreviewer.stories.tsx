import { TextPreviewer } from "./TextPreviewer";

export default {
  component: TextPreviewer,
  title: "FilePreview/Text",
};

export const Text = (): JSX.Element => (
  <TextPreviewer url="https://raw.githubusercontent.com/dataware-tools/pydtk/master/README.md" />
);
