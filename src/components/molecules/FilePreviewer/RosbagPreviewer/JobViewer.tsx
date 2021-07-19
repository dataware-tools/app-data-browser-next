import React from "react";
import { jobStore } from "@dataware-tools/app-common";
import { Button, Message, Popup } from "semantic-ui-react";

type JobViewProps = {
  jobType: jobStore.JobTypeModel;
  job: jobStore.JobPostedModel;
};
export const JobViewer = ({ job, jobType }: JobViewProps): JSX.Element => {
  return (
    <div>
      {(job?.output?.code === 200 && (
        <Message positive>
          <Message.Header>Successfully submitted the job</Message.Header>
          {Object.entries(jobType.job_type.scheme.output).map(
            ([key, value]) => {
              // @ts-expect-error typescript cant resolve this
              if (value.isExecutable) {
                const script = job.output[key];
                return (
                  <Popup
                    content={script}
                    trigger={
                      <Button
                        onClick={() => {
                          // eslint-disable-next-line no-eval
                          eval(script);
                        }}
                      >
                        Execute
                      </Button>
                    }
                  />
                );
              } else {
                return null;
              }
            }
          )}
        </Message>
      )) || (
        <Message negative>
          <Message.Header>Failed to submit the job</Message.Header>
          {
            // @ts-expect-error API type is incorrect
            job?.output?.reason && (
              // @ts-expect-error API type is incorrect
              <p>{job.output.reason}</p>
            )
          }
        </Message>
      )}
    </div>
  );
};
