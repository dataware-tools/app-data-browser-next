import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  ErrorMessage,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
  LoadingIndicator,
  ToolBar,
} from "@dataware-tools/app-common";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import ReactJson from "react-json-view";
import { RecordInfoTable } from "components/organisms/RecordInfoTable";
import { DatabaseConfigType, useGetRecord } from "utils";

export type RecordInfoPresentationProps = {
  record: metaStore.RecordModel;
  error?: ErrorMessageProps;
  isFetchComplete: boolean;
  isJsonView: boolean;
  onToggleIsJsonView: () => void;
  databaseConfig?: DatabaseConfigType;
};

export type RecordInfoProps = {
  databaseId: string;
  recordId: string;
  databaseConfig?: DatabaseConfigType;
};

export const RecordInfoPresentation = ({
  record,
  error,
  isFetchComplete,
  isJsonView,
  onToggleIsJsonView,
  databaseConfig,
}: RecordInfoPresentationProps): JSX.Element => {
  return (
    <>
      {error ? (
        <ErrorMessage {...error} />
      ) : isFetchComplete ? (
        <>
          <ToolBar
            right={
              <FormControlLabel
                control={
                  <Switch checked={isJsonView} onChange={onToggleIsJsonView} />
                }
                label="View raw json"
              />
            }
          />
          {isJsonView ? (
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
            <RecordInfoTable record={record} databaseConfig={databaseConfig} />
          )}
        </>
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

export const RecordInfo = ({
  databaseId,
  recordId,
  databaseConfig,
}: RecordInfoProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const { data: getRecordRes, error: getRecordError } = useGetRecord(
    getAccessToken,
    {
      databaseId,
      recordId,
    }
  );
  const keyIsJsonView = "isJsonView_RecordInfo";
  const [isJsonView, setIsJsonView] = useState(
    localStorage.getItem(keyIsJsonView) === "true"
  );

  const record = getRecordRes || {};
  if (Array.isArray(record.path)) {
    record.path = record.path.filter(
      (path: string) => !["", "/", "./.", "./", "/.", "."].includes(path)
    );
  }

  const error: RecordInfoPresentationProps["error"] = getRecordError
    ? extractErrorMessageFromFetchError(getRecordError)
    : undefined;
  const isFetchComplete = Boolean(!error && getRecordRes);
  const onToggleIsJsonView = () => {
    setIsJsonView((prev) => {
      prev
        ? localStorage.setItem(keyIsJsonView, "false")
        : localStorage.setItem(keyIsJsonView, "true");
      return !prev;
    });
  };

  return (
    <RecordInfoPresentation
      record={record}
      error={error}
      isFetchComplete={isFetchComplete}
      isJsonView={isJsonView}
      onToggleIsJsonView={onToggleIsJsonView}
      databaseConfig={databaseConfig}
    />
  );
};
