import { metaStore } from "@dataware-tools/app-common";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

type ComponentProps = { record: metaStore.RecordModel };
const Component = ({ record }: ComponentProps): JSX.Element => (
  <Table>
    <TableBody>
      {Object.keys(record).map((key) => {
        // TODO: implement
        if (key === "contents") {
          return (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{JSON.stringify(record.contents)}</TableCell>
            </TableRow>
          );
        } else {
          return (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{record[key]}</TableCell>
            </TableRow>
          );
        }
      })}
    </TableBody>
  </Table>
);

export { Component as RecordInfo };
export type { ComponentProps as RecordInfoProps };
