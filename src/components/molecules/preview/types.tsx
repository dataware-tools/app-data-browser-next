import { FileType } from "../../organisms/FileListItem";

type SpecType = {
  extensions: string[];
  contentTypes: string[];
};

type PreviewContainerProps = {
  file: FileType;
  url: string;
};

type ContainerWithSpecType = {
  spec: SpecType;
  container: (url: string) => JSX.Element;
}[];

export type { SpecType, PreviewContainerProps, ContainerWithSpecType };
