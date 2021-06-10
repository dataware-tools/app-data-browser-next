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

type FilePreviewerProps = {
  file: FileType;
  url: string;
};

const isExtensionsSupported = (
  candidate: ContainerWithSpecType,
  file: FileType
): boolean => {
  return candidate.spec.extensions
    .map((extension: string) => {
      return file.path.endsWith(extension);
    })
    .some((b) => {
      return b;
    });
};

const isContentTypeSupported = (
  candidate: ContainerWithSpecType,
  file: FileType
): boolean => {
  return candidate.spec.contentTypes
    .map((contentType: string) => {
      const regex = new RegExp(contentType);
      return regex.test(file["content-type"]);
    })
    .some((b) => {
      return b;
    });
};

const FilePreviewer = ({ file, url }: FilePreviewerProps): JSX.Element => {
  for (const candidate of candidates) {
    const extensionSupported = file.path
      ? isExtensionsSupported(candidate, file)
      : false;
    const contentTypeSupported = file["content-type"]
      ? isContentTypeSupported(candidate, file)
      : false;

    if (extensionSupported && contentTypeSupported) {
      return candidate.render({ url: url });
    }
    if (extensionSupported) {
      return candidate.render({ url: url });
    }
    if (contentTypeSupported) {
      return candidate.render({ url: url });
    }
  }

  return defaultPreviewerWithSpec.render({ url: url });
};

export { FilePreviewer };
export type { FilePreviewerProps };
