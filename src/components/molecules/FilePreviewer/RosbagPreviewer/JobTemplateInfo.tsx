import React from "react";
import { jobStore } from "@dataware-tools/app-common";
import { Table } from "semantic-ui-react";

type JobInfoViewProps = {
  jobTemplate: jobStore.JobTemplateModel;
  jobType: jobStore.JobTypeModel;
};

export const JobTemplateInfo = (props: JobInfoViewProps): JSX.Element => {
  return (
    <div>
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Description: </Table.Cell>
            <Table.Cell>
              {props.jobTemplate.job_template.description}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Args: </Table.Cell>
            <Table.Cell>
              {props.jobType.job_type.args.map((arg: any) => {
                return arg.name;
              })}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
