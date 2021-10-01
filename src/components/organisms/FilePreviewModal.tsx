import {
  DialogBody,
  DialogContainer,
  DialogMain,
  DialogTitle,
  DialogToolBar,
  DialogWrapper,
  usePrevious,
} from "@dataware-tools/app-common";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { useState, useEffect } from "react";
import { FilePreviewer } from "components/molecules/FilePreviewer";
import { FileType } from "components/organisms/FileListItem";
import { getFileName } from "utils";

export type FilePreviewModalPresentationProps = {
  goNextFile: () => void;
  goPrevFile: () => void;
  fileNames: { prev: string; current: string; next: string };
} & Omit<FilePreviewModalProps, "fileList">;

export type FilePreviewModalProps = DialogProps & {
  databaseId: string;
  file: FileType;
  fileList: FileType[];
  height?: string;
};

export const FilePreviewModalPresentation = ({
  databaseId,
  file,
  height,
  goPrevFile,
  goNextFile,
  fileNames,
  ...dialogProps
}: FilePreviewModalPresentationProps): JSX.Element => {
  return (
    <Dialog {...dialogProps}>
      <DialogWrapper>
        <DialogToolBar
          left={
            <Button
              startIcon={<ArrowBack />}
              onClick={goPrevFile}
              variant="text"
              sx={{ textTransform: "none" }}
            >
              {fileNames.prev}
            </Button>
          }
          right={
            <Button
              endIcon={<ArrowForward />}
              onClick={goNextFile}
              variant="text"
              sx={{ textTransform: "none" }}
            >
              {fileNames.next}
            </Button>
          }
        />
        <DialogTitle>{fileNames.current}</DialogTitle>
        <DialogContainer height={height}>
          <DialogBody>
            <DialogMain>
              <FilePreviewer databaseId={databaseId} file={file} />
            </DialogMain>
          </DialogBody>
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export const FilePreviewModal = ({
  databaseId,
  fileList,
  open,
  file: initFile,
  ...delegated
}: FilePreviewModalProps): JSX.Element => {
  const [currentFile, setCurrentFile] = useState(initFile);

  const initializeState = () => {
    setCurrentFile(initFile);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const currentFileIndex = fileList.findIndex(
    (file) => file.path === currentFile.path
  );

  const nextFileIndex =
    currentFileIndex === fileList.length - 1 ? 0 : currentFileIndex + 1;
  const nextFile = fileList[nextFileIndex];
  const goNextFile = () => {
    setCurrentFile(nextFile);
  };

  const prevFileIndex =
    currentFileIndex === 0 ? fileList.length - 1 : currentFileIndex - 1;
  const prevFile = fileList[prevFileIndex];
  const goPrevFile = () => {
    setCurrentFile(prevFile);
  };

  const fileNames = {
    prev: getFileName(prevFile.path),
    current: getFileName(currentFile.path),
    next: getFileName(nextFile.path),
  };
  return (
    <FilePreviewModalPresentation
      open={open}
      databaseId={databaseId}
      file={currentFile}
      fileNames={fileNames}
      goNextFile={goNextFile}
      goPrevFile={goPrevFile}
      {...delegated}
    />
  );
};
