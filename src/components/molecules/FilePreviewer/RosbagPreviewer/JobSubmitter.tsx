import { jobStore } from "@dataware-tools/api-job-store-client";
import Button from "@mui/material/Button";
import { JobTemplateInfo } from "./JobTemplateInfo";
import { SoloSelect } from "components/molecules/SoloSelect";

type JobSubmitterProps = {
  jobTemplateId?: string;
  jobTemplateList: jobStore.JobTemplatesModel["job_templates"];
  jobTemplate?: jobStore.JobTemplateModel;
  jobType?: jobStore.JobTypeModel;
  job?: jobStore.JobPostedModel;
  onSubmitJob: () => void;
  onChangeJobTemplate: (newValue: string) => void;
};

export const JobSubmitter = ({
  jobTemplateId,
  jobTemplateList,
  jobTemplate,
  jobType,
  job,
  onSubmitJob,
  onChangeJobTemplate,
}: JobSubmitterProps): JSX.Element => {
  return (
    <div>
      <SoloSelect
        label="Select job template"
        value={jobTemplateId}
        onChange={onChangeJobTemplate}
        options={jobTemplateList.map((jt) => {
          return { label: jt.name, value: jt.id };
        })}
      />
      {jobType && jobTemplate ? (
        <JobTemplateInfo jobTemplate={jobTemplate} jobType={jobType} />
      ) : null}
      {jobTemplate && !job ? (
        <Button onClick={() => onSubmitJob()} disabled={Boolean()}>
          Submit
        </Button>
      ) : null}
    </div>
  );
};
