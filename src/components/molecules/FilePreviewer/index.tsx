import { DefaultPreviewer } from "./DefaultPreviewer";
import { TextPreviewer } from "./TextPreviewer";
import { VideoPreviewer } from "./VideoPreviewer";
import { metaStore } from "@dataware-tools/app-common";

type FilePreviewerContentWithSpec = {
  spec: {
    extensions: string[];
    contentTypes: string[];
  };
  render: (url: string) => JSX.Element;
};

const filePreviewerCandidates: Record<string, FilePreviewerContentWithSpec> = {
  default: {
    spec: { extensions: [".*"], contentTypes: [".*"] },
    render: (url: string) => <DefaultPreviewer url={url} />,
  },
  text: {
    spec: { extensions: [".txt", ".md"], contentTypes: ["text/.*"] },
    render: (url: string) => <TextPreviewer url={url} />,
  },
  video: {
    spec: { extensions: [".mp4"], contentTypes: ["video/.*"] },
    render: (url: string) => <VideoPreviewer url={url} />,
  },
};

type FileType = metaStore.FileModel;

const isExtensionsSupported = (
  candidate: FilePreviewerContentWithSpec,
  file: FileType
): boolean => {
  return file.path
    ? candidate.spec.extensions.some((extension: string) => {
        return file.path.endsWith(extension);
      })
    : false;
};

const isContentTypeSupported = (
  candidate: FilePreviewerContentWithSpec,
  file: FileType
): boolean => {
  return file["content-type"]
    ? candidate.spec.contentTypes.some((contentType: string) => {
        const regex = new RegExp(contentType);
        return regex.test(file["content-type"]);
      })
    : false;
};

type ContainerProps = { file: FileType; url: string };

const Container = ({ file, url }: ContainerProps): JSX.Element => {
  const [, previewer] = Object.entries(filePreviewerCandidates).find(
    ([, candidate]) => {
      return (
        isExtensionsSupported(candidate, file) ||
        isContentTypeSupported(candidate, file)
      );
    }
  ) || [undefined, undefined];

  return previewer
    ? previewer.render(url)
    : filePreviewerCandidates.default.render(url);
};

export { Container as FilePreviewer };
export type { ContainerProps as FilePreviewerProps };
