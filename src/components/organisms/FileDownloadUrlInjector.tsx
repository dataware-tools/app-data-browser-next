import { useAuth0 } from "@auth0/auth0-react";
import {
  LoadingIndicator,
  API_ROUTE,
  metaStore,
} from "@dataware-tools/app-common";
import { useCreateJwtToDownloadFile } from "utils";

type FileType = metaStore.FileModel;

export type FileDownloadUrlInjectorProps = {
  file: FileType;
  render: (file: FileType, downloadURL: string) => JSX.Element;
};

export const FileDownloadUrlInjector = ({
  file,
  render,
}: FileDownloadUrlInjectorProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();

  const {
    data: createJwtRes,
    error: createJwtError,
  } = useCreateJwtToDownloadFile(
    getAccessToken,
    { requestBody: { path: file.path, content_type: file["content-type"] } },
    Boolean(file.path)
  );

  const downloadURL = createJwtRes
    ? `${API_ROUTE.FILE.BASE}/download/${createJwtRes.token}`
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
