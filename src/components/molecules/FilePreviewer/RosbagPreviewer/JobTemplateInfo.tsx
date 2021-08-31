import { jobStore } from "@dataware-tools/app-common";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import React from "react";

type JobInfoViewProps = {
  jobTemplate: jobStore.JobTemplateModel;
  jobType: jobStore.JobTypeModel;
};

export const JobTemplateInfo = ({
  jobTemplate,
  jobType,
}: JobInfoViewProps): JSX.Element => {
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Description: </TableCell>
            <TableCell>{jobTemplate.job_template.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Args: </TableCell>
            <TableCell>
              {jobType.job_type.args.map((arg: any) => {
                return arg.name;
              })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
