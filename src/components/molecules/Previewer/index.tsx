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

const Previewer = ({ file, url }: PreviewerProps): JSX.Element => {
  for (const candidate of candidates) {
    const extensionSupported = file.path
      ? isExtensionsSupported(candidate, file)
      : true;
    const contentTypeSupported = file["content-type"]
      ? isContentTypeSupported(candidate, file)
      : true;

    if (extensionSupported && contentTypeSupported) {
      return candidate.render({ url: url });
    }
  }

  return defaultPreviewerWithSpec.render({ url: url });
};

export { Previewer };
export type { PreviewerProps };
