import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import { LoadingIndicator, API_ROUTE } from "@dataware-tools/app-common";
import { useCreateJwtToDownloadFile } from "utils";

type FileType = metaStore.FileModel;

export type FileDownloadUrlInjectorProps = {
  databaseId: string;
  file: FileType;
  render: (file: FileType, downloadURL: string) => JSX.Element;
};

export const FileDownloadUrlInjector = ({
  databaseId,
  file,
  render,
}: FileDownloadUrlInjectorProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const { data: createJwtRes, error: createJwtError } =
    useCreateJwtToDownloadFile(
      getAccessToken,
      {
        requestBody: {
          database_id: databaseId,
          file_uuid: file.uuid,
          content_type: file["content-type"],
        },
      },
      Boolean(file.uuid)
    );

  const urlPrefix = API_ROUTE.FILE.BASE.startsWith("http")
    ? API_ROUTE.FILE.BASE
    : `${window.origin}${API_ROUTE.FILE.BASE}`;

  const downloadURL = createJwtRes
    ? `${urlPrefix}/download/${createJwtRes.token}`
    : undefined;
  const isFetchFailed = Boolean(createJwtError);

  return isFetchFailed ? (
    <p>Fetch failed</p>
  ) : downloadURL ? (
    render(file, downloadURL)
  ) : (
    <LoadingIndicator />
  );
};
