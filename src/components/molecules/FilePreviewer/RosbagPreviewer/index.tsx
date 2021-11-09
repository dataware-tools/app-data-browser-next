import { useAuth0 } from "@auth0/auth0-react";
import { jobStore } from "@dataware-tools/api-job-store-client";
import {
  ErrorMessageProps,
  DialogTitle,
  ErrorMessage,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useEffect, useState } from "react";
import { JobSubmitter } from "./JobSubmitter";
import { JobViewer } from "./JobViewer";
import {
  fetchJobStore,
  useGetJobTemplate,
  useGetJobTypes,
  useListJobTemplate,
} from "utils";

type Props = {
  tabIndex: number;
  handleChangeTab: (_: React.SyntheticEvent, newValue: number) => void;
  url: string;
  error?: ErrorMessageProps;
  onChangeJobTemplate: (jobTemplateId: string) => void;
  onSubmitJob: () => void;
  jobTemplateId?: string;
  jobTemplateList?: jobStore.JobTemplatesModel["job_templates"];
  jobTemplate?: jobStore.JobTemplateModel;
  jobType?: jobStore.JobTypeModel;
  job?: jobStore.JobPostedModel;
};

export type RosbagPreviewerProps = { filePath: string; url: string };
const RosbagPreviewerPresentation = ({
  tabIndex,
  handleChangeTab,
  url,
  error,
  onChangeJobTemplate,
  onSubmitJob,
  jobTemplateId,
  jobTemplateList,
  jobTemplate,
  jobType,
  job,
}: Props): JSX.Element => {
  return error ? (
    <ErrorMessage {...error} />
  ) : (
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
            variant="contained"
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
          {jobTemplateList && (
            <JobSubmitter
              jobTemplateId={jobTemplateId}
              jobTemplateList={jobTemplateList}
              jobTemplate={jobTemplate}
              jobType={jobType}
              job={job}
              onSubmitJob={onSubmitJob}
              onChangeJobTemplate={onChangeJobTemplate}
            />
          )}
          {jobType && job && <JobViewer jobType={jobType} job={job} />}
        </Box>
      )}
    </Box>
  );
};

export const RosbagPreviewer = ({
  filePath,
  url,
}: RosbagPreviewerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [jobTemplateId, setJobTemplateId] = useState<string | undefined>(
    undefined
  );
  const [job, setJob] = useState<jobStore.JobPostedModel | undefined>(
    undefined
  );
  const { data: listJobTemplateRes, error: listJobTemplateError } =
    useListJobTemplate(getAccessToken, undefined as never);
  const { data: getJobTemplateRes, error: getJobTemplateError } =
    useGetJobTemplate(getAccessToken, {
      jobTemplateId: jobTemplateId ? parseInt(jobTemplateId, 10) : undefined,
    });
  const { data: getJobTypeRes, error: getJobTypeError } = useGetJobTypes(
    getAccessToken,
    {
      jobTypeUid: getJobTemplateRes?.job_template.job_type_uid,
    }
  );

  const fetchError =
    listJobTemplateError || getJobTemplateError || getJobTypeError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } =
        extractErrorMessageFromFetchError(fetchError);
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  const onSubmitJob = async () => {
    if (!getJobTemplateRes) {
      return;
    }
    const [data, error] = await fetchJobStore(
      getAccessToken,
      jobStore.JobService.createJob,
      {
        requestBody: {
          job_template_id: parseInt(getJobTemplateRes.job_template_id),
          path_to_rosbag: filePath, // FIXME: Generalize JobPostModel
        },
      }
    );
    if (error) {
      const { reason, instruction } = extractErrorMessageFromFetchError(error);
      setError({ reason, instruction });
    } else {
      setJob(data);
    }
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <RosbagPreviewerPresentation
      tabIndex={tabIndex}
      handleChangeTab={handleChangeTab}
      url={url}
      error={error}
      jobTemplateId={jobTemplateId}
      onChangeJobTemplate={setJobTemplateId}
      onSubmitJob={onSubmitJob}
      jobTemplate={getJobTemplateRes}
      jobTemplateList={listJobTemplateRes?.job_templates}
      jobType={getJobTypeRes}
      job={job}
    />
  );
};
