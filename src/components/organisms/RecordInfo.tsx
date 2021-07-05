import {
  ErrorMessage,
  ErrorMessageProps,
  LoadingIndicator,
  metaStore,
} from "@dataware-tools/app-common";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { useGetRecord } from "utils";
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  record: metaStore.RecordModel;
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
};
type ContainerProps = { databaseId: string; recordId: string };
const Component = ({ record, error, isFetchComplete }: Props): JSX.Element => (
  <>
    {error ? (
      <ErrorMessage {...error} />
    ) : isFetchComplete ? (
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
    ) : (
      <LoadingIndicator />
    )}
  </>
);

const Container = ({ databaseId, recordId }: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const { data: getRecordRes, error: getRecordError } = useGetRecord(
    getAccessToken,
    {
      databaseId,
      recordId,
    }
  );

  const record = getRecordRes || {};
  const error: Props["error"] = getRecordError
    ? {
        reason: JSON.stringify(getRecordError),
        instruction: "Please reload this page",
      }
    : undefined;
  const isFetchComplete = Boolean(!error && getRecordRes);

  return (
    <Component
      record={record}
      error={error}
      isFetchComplete={isFetchComplete}
    />
  );
};

export { Container as RecordInfo };
export type { ContainerProps as RecordInfoProps };
