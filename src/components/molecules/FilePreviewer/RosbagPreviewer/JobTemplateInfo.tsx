import { jobStore } from "@dataware-tools/app-common";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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
