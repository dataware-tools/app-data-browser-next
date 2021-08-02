import dynamic from "next/dynamic";
import { DefaultPreviewer } from "./DefaultPreviewer";
import { TextPreviewer } from "./TextPreviewer";
import { VideoPreviewer } from "./VideoPreviewer";
import { metaStore } from "@dataware-tools/app-common";
import { FileDownloadURLInjector } from "components/organisms/FileDownloadUrlInjector";
import { RosbagPreviewer } from "./RosbagPreviewer";
import {
  SourceCodePreviewer,
  extensions as sourceCodeExtensions,
} from "./SourceCodePreviewer";
import { MarkdownPreviewer } from "./MarkDownPreviewer";
import { ImagePreviewer } from "./ImagePreviewer";
import { CsvPreviewer } from "./CsvPreviewer";
const AudioPreviewer = dynamic<any>(
  () => import("./AudioPreviewer").then((module) => module.AudioPreviewer),
  { ssr: false }
);

type FilePreviewerContentWithSpec = {
  spec: {
    extensions: string[];
    contentTypes: string[];
  };
  render: (file: FileType) => JSX.Element;
};

const filePreviewerCandidates: Record<string, FilePreviewerContentWithSpec> = {
  default: {
    spec: { extensions: [".*"], contentTypes: [".*"] },
    render: (file) => (
      <FileDownloadURLInjector
        file={file}
        render={() => <DefaultPreviewer />}
      />
    ),
  },
  text: {
    spec: { extensions: [".txt"], contentTypes: ["text/.*"] },
    render: (file) => (
      <FileDownloadURLInjector
        file={file}
        render={(_, url) => <TextPreviewer url={url} />}
      />
    ),
  },
  markdown: {
    spec: { extensions: [".md"], contentTypes: ["text/.*"] },
    render: (file) => (
      <FileDownloadURLInjector
        file={file}
        render={(_, url) => <MarkdownPreviewer url={url} />}
      />
    ),
  },
  csv: {
    spec: { extensions: [".csv"], contentTypes: ["csv/.*"] },
    render: (file) => (
      <FileDownloadURLInjector
        file={file}
        render={(_, url) => <CsvPreviewer url={url} />}
      />
    ),
  },
  video: {
    spec: { extensions: [".mp4"], contentTypes: ["video/.*"] },
    render: (file) => (
      <FileDownloadURLInjector
        file={file}
        render={(_, url) => <VideoPreviewer url={url} />}
      />
    ),
  },
  sourceCode: {
    spec: {
      extensions: sourceCodeExtensions,
      contentTypes: ["text/.*"],
    },
    render: (file) => (
      <FileDownloadURLInjector
        file={file}
        render={(file, url) => <SourceCodePreviewer file={file} url={url} />}
      />
    ),
  },
  image: {
    spec: {
      extensions: [".jpg", ".jpeg", ".png", ".gif"],
      contentTypes: ["image/.*"],
    },
    render: (file) => (
      <FileDownloadURLInjector
        file={file}
        render={(_, url) => <ImagePreviewer url={url} />}
      />
    ),
  },
  rosbag: {
    spec: { extensions: ["bag"], contentTypes: ["application/rosbag"] },
    render: (file) => <RosbagPreviewer filePath={file.path} />,
  },
  audio: {
    spec: { extensions: [".wav", ".mp3"], contentTypes: ["audio/.*"] },
    render: (file) => (
      <FileDownloadURLInjector
        file={file}
        render={(_, url) => <AudioPreviewer url={url} />}
      />
    ),
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

type ContainerProps = { file: FileType };

const Container = ({ file }: ContainerProps): JSX.Element => {
  const [, previewer] = Object.entries(filePreviewerCandidates).find(
    ([, candidate]) => {
      return (
        isExtensionsSupported(candidate, file) ||
        isContentTypeSupported(candidate, file)
      );
    }
  ) || [undefined, undefined];

  return previewer
    ? previewer.render(file)
    : filePreviewerCandidates.default.render(file);
};

export { Container as FilePreviewer };
export type { ContainerProps as FilePreviewerProps };
