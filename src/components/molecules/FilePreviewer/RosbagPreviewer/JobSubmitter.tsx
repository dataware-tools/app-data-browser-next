import { useAuth0 } from "@auth0/auth0-react";
import { jobStore } from "@dataware-tools/api-job-store-client";
import {
  ErrorMessage,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { JobTemplateInfo } from "./JobTemplateInfo";
import { JobViewer } from "./JobViewer";
import { SoloSelect } from "components/molecules/SoloSelect";
import {
  fetchJobStore,
  useGetJobTemplate,
  useGetJobTypes,
  useListJobTemplate,
} from "utils";

type JobSubmitterProps = {
  databaseId: string;
  recordId: string;
  filePath: string;
};

export const JobSubmitter = ({
  databaseId,
  recordId,
  filePath,
}: JobSubmitterProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [jobTemplateId, setJobTemplateId] = useState<string | undefined>("");
  const [job, setJob] = useState<jobStore.JobPostedModel | undefined>(
    undefined
  );
  const { data: listJobTemplateRes, error: listJobTemplateError } =
    useListJobTemplate(getAccessToken, { databaseId });
  const { data: getJobTemplateRes, error: getJobTemplateError } =
    useGetJobTemplate(getAccessToken, {
      jobTemplateId: jobTemplateId ? parseInt(jobTemplateId, 10) : undefined,
      databaseId: databaseId,
    });
  const { data: getJobTypeRes, error: getJobTypeError } = useGetJobTypes(
    getAccessToken,
    {
      jobTypeUid: getJobTemplateRes?.job_template.job_type_uid,
      databaseId: databaseId,
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
        databaseId: databaseId,
        requestBody: {
          job_template_id: parseInt(getJobTemplateRes.job_template_id),
          database_id: databaseId,
          record_id: recordId,
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

  return error ? (
    <ErrorMessage {...error} />
  ) : (
    <div>
      <SoloSelect
        label="Select job template"
        value={jobTemplateId}
        onChange={setJobTemplateId}
        options={
          listJobTemplateRes
            ? listJobTemplateRes.job_templates.map((jt) => {
                return { label: jt.name, value: jt.id };
              })
            : []
        }
      />
      {getJobTypeRes && getJobTemplateRes ? (
        <JobTemplateInfo
          jobTemplate={getJobTemplateRes}
          jobType={getJobTypeRes}
        />
      ) : null}
      {getJobTemplateRes && !job ? (
        <Button onClick={() => onSubmitJob()} disabled={Boolean()}>
          Submit
        </Button>
      ) : null}
      {getJobTypeRes && job && <JobViewer jobType={getJobTypeRes} job={job} />}
    </div>
  );
};
