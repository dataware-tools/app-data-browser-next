import { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import { parse } from "papaparse";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

type CsvPreviewerProps = { url: string };
export const CsvPreviewer = ({
  url,
}: CsvPreviewerProps): JSX.Element | null => {
  const [content, setContent] = useState<string[][] | undefined>(undefined);

  useEffect(() => {
    fetch(url)
      .then((resp) => {
        return resp.text();
      })
      .then((text) => {
        if (text) {
          setContent((parse<string>(text).data as unknown) as string[][]);
        }
      });
  }, [url]);

  return content ? (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {content[0].map((cell, i) => (
              <TableCell key={i}>{cell}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map((row, i) =>
            i === 0 ? null : (
              <TableRow key={i}>
                {row.map((cell, i) => (
                  <TableCell key={i}>{cell}</TableCell>
                ))}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};
