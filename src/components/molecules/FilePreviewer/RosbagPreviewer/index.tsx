import { DialogTitle } from "@dataware-tools/app-common";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";
import { JobSubmitter } from "./JobSubmitter";

type Props = {
  tabIndex: number;
  handleChangeTab: (_: React.SyntheticEvent, newValue: number) => void;
} & RosbagPreviewerProps;

export type RosbagPreviewerProps = {
  databaseId: string;
  recordId: string;
  filePath: string;
  url: string;
};
const RosbagPreviewerPresentation = ({
  tabIndex,
  handleChangeTab,
  url,
  databaseId,
  recordId,
  filePath,
}: Props): JSX.Element => {
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleChangeTab} aria-label="tabs">
          <Tab label="webviz" />
          <Tab label="webviz with rosbridge" />
        </Tabs>
      </Box>
      {tabIndex === 0 && (
        <Box sx={{ paddingTop: "1em" }}>
          <Button
            onClick={() => {
              window.open(
                "https://webviz.io/app?remote-bag-url=" + url,
                "_blank"
              );
            }}
          >
            Open with webviz
          </Button>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box>
          <DialogTitle>Submit a job</DialogTitle>
          <JobSubmitter
            databaseId={databaseId}
            recordId={recordId}
            filePath={filePath}
          />
        </Box>
      )}
    </Box>
  );
};

export const RosbagPreviewer = ({
  databaseId,
  recordId,
  filePath,
  url,
}: RosbagPreviewerProps): JSX.Element => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <RosbagPreviewerPresentation
      tabIndex={tabIndex}
      handleChangeTab={handleChangeTab}
      url={url}
      databaseId={databaseId}
      recordId={recordId}
      filePath={filePath}
    />
  );
};
