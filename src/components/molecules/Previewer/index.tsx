import { FileType } from "components/organisms/FileListItem";

import { ContainerWithSpecType } from "./types";
import { defaultPreviewerWithSpec } from "./Default";
import { textPreviewerWithSpec } from "./Text";
import { videoPreviewerWithSpec } from "./Video";

const candidates: ContainerWithSpecType[] = [
  textPreviewerWithSpec,
  videoPreviewerWithSpec,
  defaultPreviewerWithSpec,
];

type PreviewerProps = {
  file: FileType;
  url: string;
};

const Previewer = ({ file, url }: PreviewerProps): JSX.Element => {
  for (const candidate of candidates) {
    let isExtensionSupported = false;
    let isContentTypeSupported = false;

    if (file.path) {
      for (const extension of candidate.spec.extensions) {
        if (file.path.endsWith(extension)) {
          isExtensionSupported = true;
        }
      }
    }
    if (file["content-type"]) {
      for (const contentType of candidate.spec.contentTypes) {
        const regex = new RegExp(contentType);
        if (regex.test(file["content-type"])) {
          isContentTypeSupported = true;
        }
      }
    } else {
      isContentTypeSupported = true;
    }

    if (isExtensionSupported && isContentTypeSupported) {
      return candidate.render({ url: url });
    }
  }

  return defaultPreviewerWithSpec.render({ url: url });
};

export { Previewer };
export type { PreviewerProps };
