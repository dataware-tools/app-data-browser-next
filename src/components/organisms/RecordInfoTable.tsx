import { metaStore } from "@dataware-tools/api-meta-store-client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell, { TableCellProps } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ReactJson from "react-json-view";
import { DatabaseConfigType } from "../../utils";

export type RecordInfoTablePresentationProps = RecordInfoTableProps;

export type RecordInfoTableProps = {
  record: metaStore.RecordModel;
  databaseConfig?: DatabaseConfigType;
};

export const RecordInfoTablePresentation = ({
  record,
  databaseConfig,
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
          const columnConfig =
            databaseConfig?.columns.find((element) => element.name === key) ||
            null;
          const displayKey = columnConfig ? columnConfig.display_name : key;
          return (
            <TableRow key={key}>
              <TableCell>{displayKey}</TableCell>
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
