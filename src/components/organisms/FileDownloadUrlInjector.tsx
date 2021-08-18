import { useAuth0 } from "@auth0/auth0-react";
import {
  LoadingIndicator,
  API_ROUTE,
  metaStore,
} from "@dataware-tools/app-common";
import { useCreateJwtToDownloadFile } from "utils";

type FileType = metaStore.FileModel;

type ContainerProps = {
  file: FileType;
  render: (file: FileType, downloadURL: string) => JSX.Element;
};

const Container = ({ file, render }: ContainerProps): JSX.Element => {
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

export { Container as FileDownloadURLInjector };
export type { ContainerProps as FileDownloadUrlInjectorProps };
