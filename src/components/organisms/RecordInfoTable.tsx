import { metaStore } from "@dataware-tools/app-common";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
const ReactJson = dynamic(import("react-json-view"), { ssr: false });

export type RecordInfoTableDOMProps = {
  classes: ReturnType<typeof useStyles>;
} & RecordInfoTableProps;

export type RecordInfoTableProps = {
  record: metaStore.RecordModel;
};

export const RecordInfoTableDOM = (
  props: RecordInfoTableDOMProps
): JSX.Element => {
  const { record, classes } = props;
  const TableCell = (props: TableCellProps) => (
    <MuiTableCell className={classes.tableCell} {...props} />
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

const useStyles = makeStyles({
  tableCell: {
    maxWidth: "40rem",
    overflowWrap: "break-word",
  },
});

export const RecordInfoTable = (props: RecordInfoTableProps): JSX.Element => {
  const { ...delegated } = props;
  return <RecordInfoTableDOM {...delegated} classes={useStyles()} />;
};
