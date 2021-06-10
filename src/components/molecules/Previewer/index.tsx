import { FileType } from "components/organisms/FileListItem";

import { ContainerWithSpecType } from "./types";
import { defaultPreviewWithSpec } from "./Default";
import { textPreviewWithSpec } from "./Text";
import { videoPreviewWithSpec } from "./Video";

const candidates: ContainerWithSpecType = [
  textPreviewWithSpec,
  videoPreviewWithSpec,
  defaultPreviewWithSpec,
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
      return candidate.render(url);
    }
  }

  return defaultPreviewWithSpec.render(url);
};

export { Previewer };
export type { PreviewerProps };
