import {
  LoadingIndicator,
  API_ROUTE,
  metaStore,
} from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import { useCreateJwtToDownloadFile } from "utils";
import { ReactNode } from "react";

type FileType = metaStore.FileModel;

type ContainerProps = {
  file: FileType;
  render: (file: FileType, downloadURL: string) => ReactNode;
};

const Container = ({ file, render }: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();

  const [createJwtRes, createJwtError] = useCreateJwtToDownloadFile(
    getAccessToken,
    { requestBody: { path: file.path, content_type: file["content-type"] } },
    Boolean(file.path)
  );
  const downloadURL = createJwtRes
    ? `${API_ROUTE.FILE.BASE}/download/${createJwtRes.token}`
    : undefined;

  const isFetchFailed = Boolean(createJwtError);

  return (
    <>
      {isFetchFailed ? (
        <p>Fetch failed</p>
      ) : downloadURL ? (
        render(file, downloadURL)
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

export { Container as FileDownloadURLInjector };
export type { ContainerProps as FileDownloadUrlInjectorProps };
