import {
  ErrorMessage,
  ErrorMessageProps,
  LoadingIndicator,
  metaStore,
} from "@dataware-tools/app-common";
import { useGetRecord } from "utils";
import { useAuth0 } from "@auth0/auth0-react";
import dynamic from "next/dynamic";
const ReactJson = dynamic(import("react-json-view"), { ssr: false });

type Props = {
  record: metaStore.RecordModel;
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
};
type ContainerProps = { databaseId: string; recordId: string };
const Component = ({ record, error, isFetchComplete }: Props): JSX.Element => {
  return (
    <>
      {error ? (
        <ErrorMessage {...error} />
      ) : isFetchComplete ? (
        <ReactJson
          src={record}
          style={{
            overflowWrap: "break-word",
          }}
          displayDataTypes={false}
          quotesOnKeys={false}
          collapseStringsAfterLength={80}
        />
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

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
  record.path = record.path.filter(
    (path: string) => !["", "/", "./.", "./", "/.", "."].includes(path)
  );
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
