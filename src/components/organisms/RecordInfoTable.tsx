import { metaStore } from "@dataware-tools/api-meta-store-client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell, { TableCellProps } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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
