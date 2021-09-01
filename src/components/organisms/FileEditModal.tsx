import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
  metaStore,
} from "@dataware-tools/app-common";
import { useEffect, useMemo, useState } from "react";
import {
  MetadataEditModal,
  MetadataEditModalProps,
} from "components/organisms/MetadataEditModal";
import {
  compInputFields,
  fetchMetaStore,
  useGetConfig,
  useListFiles,
  useGetFile,
  editableColumnDtype,
  isEditableColumnName,
} from "utils";

export type FileEditModalProps = {
  open: boolean;
  onClose: () => void;
  recordId: string;
  uuid: string;
  databaseId: string;
  onSubmitSucceeded?: (newFile: metaStore.FileModel) => void;
};

export const FileEditModal = ({
  uuid,
  recordId,
  databaseId,
  onSubmitSucceeded,
  open,
  ...delegated
}: FileEditModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

  const {
    data: listFilesRes,
    mutate: listFilesMutate,
  } = useListFiles(getAccessToken, { databaseId, recordId });
  const {
    data: getFileRes,
    error: getFileError,
    mutate: getFileMutate,
  } = useGetFile(getAccessToken, {
    databaseId,
    uuid,
  });

  const { data: getConfigRes, error: getConfigError } = useGetConfig(
    getAccessToken,
    {
      databaseId,
    }
  );

  const fields: MetadataEditModalProps["fields"] = useMemo(
    () =>
      getConfigRes?.columns
        .filter(
          (column) =>
            isEditableColumnName(getConfigRes, column.name) &&
            column.aggregation !== "first" &&
            editableColumnDtype.includes(column.dtype)
        )
        .map((column) => ({
          name: column.name,
          display_name: column.display_name,
          necessity: column.necessity || "unnecessary",
        }))
        .sort(compInputFields) || [],
    [getConfigRes]
  );
  const fetchError = getFileError || getConfigError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } = extractErrorMessageFromFetchError(
        fetchError
      );
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError, fields]);

  const onSubmit: MetadataEditModalProps["onSubmit"] = async (newFileInfo) => {
    const [saveFileRes, saveFileError] = await fetchMetaStore(
      getAccessToken,
      metaStore.FileService.updateFile,
      {
        uuid,
        databaseId,
        requestBody: newFileInfo,
      }
    );

    if (saveFileError) {
      const { reason, instruction } = extractErrorMessageFromFetchError(
        saveFileError
      );
      setError({ reason, instruction });
      return false;
    }

    if (saveFileRes && listFilesRes) {
      getFileMutate(saveFileRes);
      listFilesMutate({
        ...listFilesRes,
        data: listFilesRes?.data.map((file) =>
          file.uuid === saveFileRes.uuid ? saveFileRes : file
        ),
      });
      onSubmitSucceeded && saveFileRes && onSubmitSucceeded(saveFileRes);
    }

    return true;
  };

  const title = "Edit file";

  return (
    <MetadataEditModal
      title={title}
      open={open}
      currentMetadata={getFileRes}
      fields={fields}
      error={error}
      onSubmit={onSubmit}
      {...delegated}
    />
  );
};
