import { metaStore } from "@dataware-tools/api-meta-store-client";
import { AudioPreviewer } from "./AudioPreviewer";
import { CsvPreviewer } from "./CsvPreviewer";
import { DefaultPreviewer } from "./DefaultPreviewer";
import { ImagePreviewer } from "./ImagePreviewer";
import { MarkdownPreviewer } from "./MarkDownPreviewer";
import { RosbagPreviewer } from "./RosbagPreviewer";
import {
  SourceCodePreviewer,
  extensions as sourceCodeExtensions,
} from "./SourceCodePreviewer";
import { TextPreviewer } from "./TextPreviewer";
import { VideoPreviewer } from "./VideoPreviewer";
import { FileDownloadUrlInjector } from "components/organisms/FileDownloadUrlInjector";

type FilePreviewerContentRenderSpec = {
  databaseId: string;
  recordId: string;
  file: FileType;
};

type FilePreviewerContentWithSpec = {
  spec: {
    extensions: string[];
    contentTypes: string[];
  };
  render: ({
    databaseId,
    recordId,
    file,
  }: FilePreviewerContentRenderSpec) => JSX.Element;
};

const filePreviewerCandidates: Record<string, FilePreviewerContentWithSpec> = {
  default: {
    spec: { extensions: [".*"], contentTypes: [".*"] },
    render: ({ databaseId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
        file={file}
        render={() => <DefaultPreviewer />}
      />
    ),
  },
  text: {
    spec: { extensions: [".txt"], contentTypes: ["text/.*"] },
    render: ({ databaseId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
        file={file}
        render={(_, url) => <TextPreviewer url={url} />}
      />
    ),
  },
  markdown: {
    spec: { extensions: [".md"], contentTypes: ["text/.*"] },
    render: ({ databaseId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
        file={file}
        render={(_, url) => <MarkdownPreviewer url={url} />}
      />
    ),
  },
  csv: {
    spec: { extensions: [".csv"], contentTypes: ["csv/.*"] },
    render: ({ databaseId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
        file={file}
        render={(_, url) => <CsvPreviewer url={url} />}
      />
    ),
  },
  video: {
    spec: { extensions: [".mp4"], contentTypes: ["video/.*"] },
    render: ({ databaseId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
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
    render: ({ databaseId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
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
    render: ({ databaseId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
        file={file}
        render={(_, url) => <ImagePreviewer url={url} />}
      />
    ),
  },
  rosbag: {
    spec: { extensions: [".bag"], contentTypes: ["application/rosbag"] },
    render: ({ databaseId, recordId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
        file={file}
        render={(_, url) => (
          <RosbagPreviewer
            databaseId={databaseId}
            recordId={recordId}
            filePath={file.path}
            url={url}
          />
        )}
      />
    ),
  },
  audio: {
    spec: { extensions: [".wav", ".mp3"], contentTypes: ["audio/.*"] },
    render: ({ databaseId, file }) => (
      <FileDownloadUrlInjector
        databaseId={databaseId}
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

export type FilePreviewerProps = {
  databaseId: string;
  recordId: string;
  file: FileType;
};

export const FilePreviewer = ({
  databaseId,
  recordId,
  file,
}: FilePreviewerProps): JSX.Element => {
  const [, previewer] = Object.entries(filePreviewerCandidates).find(
    ([, candidate]) => {
      return (
        isExtensionsSupported(candidate, file) ||
        isContentTypeSupported(candidate, file)
      );
    }
  ) || [undefined, undefined];

  return previewer
    ? previewer.render({ databaseId, recordId, file })
    : filePreviewerCandidates.default.render({ databaseId, recordId, file });
};
