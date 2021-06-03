import { metaStore } from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import {
  MetadataEditModal,
  MetadataEditModalProps,
} from "components/organisms/MetadataEditModal";
import { fetchAPI, useGetRecord } from "utils";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  recordId?: string;
  databaseId: string;
  onSubmitSucceeded: (newRecord: metaStore.RecordModel) => void;
  create?: boolean;
};

const Container = ({
  recordId,
  databaseId,
  onSubmitSucceeded,
  ...delegated
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();

  const [getRecordRes, getRecordError] = useGetRecord(getAccessToken, {
    databaseId,
    recordId,
  });
  const onSubmit: MetadataEditModalProps["onSubmit"] = async (
    newRecordInfo
  ) => {
    const [saveRecordRes] = recordId
      ? await fetchAPI(getAccessToken, metaStore.RecordService.updateRecord, {
          recordId,
          databaseId,
          requestBody: newRecordInfo,
        })
      : await fetchAPI(getAccessToken, metaStore.RecordService.createRecord, {
          databaseId,
          requestBody: newRecordInfo,
        });

    if (saveRecordRes) onSubmitSucceeded(saveRecordRes);
    return Boolean(saveRecordRes);
  };

  return (
    <MetadataEditModal
      databaseId={databaseId}
      data={getRecordRes}
      error={getRecordError}
      onSubmit={onSubmit}
      {...delegated}
    />
  );
};

export { Container as RecordEditModal };
