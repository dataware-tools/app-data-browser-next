import { metaStore } from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import {
  MetadataEditModal,
  MetadataEditModalProps,
} from "components/organisms/MetadataEditModal";
import {
  fetchMetaStore,
  useGetRecord,
  DatabaseConfigType,
  useGetConfig,
} from "utils";

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
  create,
  ...delegated
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();

  const [getRecordRes, getRecordError] = useGetRecord(getAccessToken, {
    databaseId,
    recordId,
  });

  const [getConfigRes, getConfigError] = (useGetConfig(getAccessToken, {
    databaseId,
  }) as unknown) as [
    data: DatabaseConfigType | undefined,
    error: any,
    cacheKey: string
  ];

  const record_input_config =
    getConfigRes?.data_browser_config?.record_add_inputable_columns;
  const columns = getConfigRes?.columns;
  const inputConfig =
    record_input_config && columns
      ? record_input_config.map((config) => ({
          ...config,
          display_name:
            columns.find((column) => column.name === config.name)
              ?.display_name || "",
        }))
      : null;

  const onSubmit: MetadataEditModalProps["onSubmit"] = async (
    newRecordInfo
  ) => {
    if (create) {
      newRecordInfo.path = "";
      const [saveRecordRes] = await fetchMetaStore(
        getAccessToken,
        metaStore.RecordService.createRecord,
        {
          databaseId,
          requestBody: newRecordInfo,
        }
      );
      if (saveRecordRes) onSubmitSucceeded(saveRecordRes);
      return Boolean(saveRecordRes);
    } else {
      if (recordId) {
        const [saveRecordRes] = await fetchMetaStore(
          getAccessToken,
          metaStore.RecordService.updateRecord,
          {
            recordId,
            databaseId,
            requestBody: newRecordInfo,
          }
        );

        if (saveRecordRes) onSubmitSucceeded(saveRecordRes);
        return Boolean(saveRecordRes);
      }
      return false;
    }
  };

  return (
    <MetadataEditModal
      currentMetadata={getRecordRes}
      inputConfig={inputConfig}
      error={getRecordError || getConfigError}
      onSubmit={onSubmit}
      create={create}
      {...delegated}
    />
  );
};

export { Container as RecordEditModal };
export type { ContainerProps as RecordEditModalProps };
