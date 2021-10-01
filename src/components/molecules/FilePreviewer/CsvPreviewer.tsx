import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { parse } from "papaparse";
import { useState, useEffect } from "react";

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
