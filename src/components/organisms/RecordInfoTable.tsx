import { metaStore } from "@dataware-tools/app-common";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import dynamic from "next/dynamic";
const ReactJson = dynamic(import("react-json-view"), { ssr: false });

export type RecordInfoTablePresentationProps = RecordInfoTableProps;

export type RecordInfoTableProps = {
  record: metaStore.RecordModel;
};

export const RecordInfoTablePresentation = ({
  record,
}: RecordInfoTablePresentationProps): JSX.Element => {
  const TableCell = ({ ...delegated }: TableCellProps) => (
    <MuiTableCell
      sx={{ maxWidth: "40rem", overflowWrap: "break-word" }}
      {...delegated}
    />
  );

  return (
    <Table>
      <TableBody>
        {Object.keys(record).map((key) => {
          const value = record[key];
          return (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>
                {value !== null && typeof value === "object" ? (
                  <ReactJson
                    src={value}
                    displayDataTypes={false}
                    quotesOnKeys={false}
                    collapseStringsAfterLength={80}
                    enableClipboard={false}
                    collapsed
                  />
                ) : (
                  value
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export const RecordInfoTable = ({
  ...delegated
}: RecordInfoTableProps): JSX.Element => {
  return <RecordInfoTablePresentation {...delegated} />;
};
