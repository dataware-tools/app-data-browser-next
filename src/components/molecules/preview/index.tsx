import { ContainerWithSpecType, PreviewContainerProps } from "./types";

import DefaultPreview from "./Default";
import TextPreview from "./Text";
import VideoPreview from "./Video";

const candidates: ContainerWithSpecType = [
  TextPreview,
  VideoPreview,
  DefaultPreview,
];

const PreviewContainer = ({
  file,
  url,
}: PreviewContainerProps): JSX.Element => {
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
      return candidate.container(url);
    }
  }

  return DefaultPreview.container(url);
};

export { PreviewContainer };
export type { PreviewContainerProps };
