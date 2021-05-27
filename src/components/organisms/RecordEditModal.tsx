import { metaStore, API_ROUTE } from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import {
  MetadataEditModal,
  MetadataEditModalProps,
} from "components/organisms/MetadataEditModal";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  recordId?: string;
  databaseId: string;
  onSubmitSucceeded: (newRecord: metaStore.RecordModel) => void;
};

const Container = ({
  open,
  onClose,
  recordId,
  databaseId,
  onSubmitSucceeded,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently } = useAuth0();

  const getRecordURL = `${API_ROUTE.META.BASE}/databases/${databaseId}/records/${recordId}`;
  const getRecord = async () => {
    metaStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    if (recordId) {
      const listRecordsRes = await metaStore.RecordService.getRecord(
        recordId,
        databaseId
      );
      return listRecordsRes;
    } else {
      return undefined;
    }
  };

  const onSubmit: MetadataEditModalProps["onSubmit"] = async (
    newRecordInfo
  ) => {
    metaStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    // TODO: fix API
    const saveRecordRes = recordId
      ? await metaStore.RecordService.updateRecord(
          recordId,
          databaseId,
          newRecordInfo
        ).catch(() => undefined)
      : await metaStore.RecordService.createRecord(
          databaseId,
          // @ts-expect-error fixAPI
          newRecordInfo
        ).catch(() => undefined);

    saveRecordRes && onSubmitSucceeded(saveRecordRes);
    return Boolean(saveRecordRes);
  };

  return (
    <MetadataEditModal
      getMetadata={getRecord}
      getMetadataURL={getRecordURL}
      open={open}
      onClose={onClose}
      recordId={recordId}
      onSubmit={onSubmit}
    />
  );
};

export { Container as RecordEditModal };
