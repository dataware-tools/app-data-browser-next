import {
  API_ROUTE,
  fileProvider,
  metaStore,
  objToQueryString,
  permissionManager,
} from "@dataware-tools/app-common";
import useSWR, { SWRResponse } from "swr";
import { AwaitType, DatabaseConfigType } from "utils/utilTypes";
import { useState, useEffect } from "react";

type Data<T> = T extends void | undefined | null
  ? "__fetchSuccess__" | undefined
  : T | undefined;

const fetchAPI = async <T, U>(
  fetcher: (args: T) => Promise<U>,
  param: T
): Promise<[data: Data<U>, error: any]> => {
  try {
    const res = await fetcher(param);
    // See: https://miyauchi.dev/ja/posts/typescript-conditional-types#%E5%9E%8B%E5%AE%9A%E7%BE%A9%E3%81%A8-conditional-types
    return [(res || "__fetchSuccess__") as Data<U>, undefined];
  } catch (error) {
    return [undefined as Data<U>, error];
  }
};

const fetchMetaStore = async <T, U>(
  token: string | (() => Promise<string>),
  fetcher: (args: T) => Promise<U>,
  param: T
): Promise<[data: Data<U>, error: any]> => {
  metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
  metaStore.OpenAPI.TOKEN = token;
  return await fetchAPI(fetcher, param);
};

const fetchFileProvider = async <T, U>(
  token: string | (() => Promise<string>),
  fetcher: (args: T) => Promise<U>,
  param: T
): Promise<[data: Data<U>, error: any]> => {
  fileProvider.OpenAPI.BASE = API_ROUTE.FILE.BASE;
  fileProvider.OpenAPI.TOKEN = token;
  return await fetchAPI(fetcher, param);
};

// TODO: If openapi-typescript-codegen support multipart/formData schema, deprecate below fetching
// See: https://github.com/ferdikoomen/openapi-typescript-codegen/issues/257
const uploadFileToFileProvider = async (
  token: string | (() => Promise<string>),
  {
    databaseId,
    recordId,
    requestBody,
  }: Parameters<typeof fileProvider.UploadService.uploadFile>[number]
): Promise<
  [
    data: Data<
      AwaitType<ReturnType<typeof fileProvider.UploadService.uploadFile>>
    >,
    error: any
  ]
> => {
  const accessToken = typeof token === "string" ? token : await token();

  const [data, error] = await fetch(
    `${API_ROUTE.FILE.BASE}/upload?database_id=${databaseId}&record_id=${recordId}`,
    {
      method: "POST",
      body: requestBody,
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        return error;
      }
      return res.json();
    })
    .then((resBody) => [resBody || "__fetchSuccess__", undefined])
    .catch((error) => [undefined, error]);

  return [data, error];
};

interface UseAPI<T extends (...args: any) => Promise<any>> {
  (
    token: string | (() => Promise<string>),
    param: Partial<Parameters<T>[number]>,
    shouldFetch?: boolean
  ): SWRResponse<AwaitType<ReturnType<T>>, any> & { cacheKey: string };
}

interface UseAPIWithoutCache<T extends (...args: any) => Promise<any>> {
  (...args: Parameters<UseAPI<T>>): {
    data: AwaitType<ReturnType<T>> | undefined;
    error: any;
  };
}

const useListPermittedActions: UseAPI<
  typeof permissionManager.PermittedActionService.listPermittedActions
> = (token, { databaseId, ...query }, shouldFetch = true) => {
  const cacheQuery = objToQueryString({ databaseId, ...query });
  const cacheKey = `${API_ROUTE.PERMISSION.BASE}/actions${cacheQuery}`;
  const fetcher = databaseId
    ? async () => {
        permissionManager.OpenAPI.TOKEN = token;
        permissionManager.OpenAPI.BASE = API_ROUTE.PERMISSION.BASE;
        const res = await permissionManager.PermittedActionService.listPermittedActions(
          { databaseId, ...query }
        );
        return res;
      }
    : null;
  const resSWR = useSWR(shouldFetch && databaseId ? cacheKey : null, fetcher);
  return { ...resSWR, cacheKey };
};

const useListDatabases: UseAPI<
  typeof metaStore.DatabaseService.listDatabases
> = (token, { ...query }, shouldFetch = true) => {
  const cacheQuery = objToQueryString({ ...query });
  const cacheKey = `${API_ROUTE.META.BASE}/databases/${cacheQuery}`;
  const fetcher = async () => {
    metaStore.OpenAPI.TOKEN = token;
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    const res = await metaStore.DatabaseService.listDatabases(query);
    return res;
  };
  const swrRes = useSWR(shouldFetch ? cacheKey : null, fetcher);
  return { ...swrRes, cacheKey };
};

interface UseGetConfig<T extends (...args: any) => Promise<any>> {
  (...args: Parameters<UseAPI<T>>): {
    data: DatabaseConfigType | undefined;
  } & Omit<ReturnType<UseAPI<T>>, "data">;
}
const useGetConfig: UseGetConfig<typeof metaStore.ConfigService.getConfig> = (
  token,
  { databaseId },
  shouldFetch = true
) => {
  const cacheKey = `${API_ROUTE.META.BASE}/databases/${databaseId}/config`;
  const fetcher = databaseId
    ? async () => {
        metaStore.OpenAPI.TOKEN = token;
        metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
        const res = await metaStore.ConfigService.getConfig({
          databaseId,
        });
        return res;
      }
    : null;

  const { data, ...rest } = useSWR(
    shouldFetch && databaseId ? cacheKey : null,
    fetcher
  );
  return { data: data as DatabaseConfigType | undefined, ...rest, cacheKey };
};

const useGetRecord: UseAPI<typeof metaStore.RecordService.getRecord> = (
  token,
  { databaseId, recordId },
  shouldFetch = true
) => {
  const cacheKey = `${API_ROUTE.META.BASE}/databases/${databaseId}/records/${recordId}`;
  const fetcher =
    databaseId && recordId
      ? async () => {
          metaStore.OpenAPI.TOKEN = token;
          metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
          const res = await metaStore.RecordService.getRecord({
            databaseId,
            recordId,
          });
          return res;
        }
      : null;

  const swrRes = useSWR(
    shouldFetch && databaseId && recordId ? cacheKey : null,
    fetcher
  );
  return { ...swrRes, cacheKey };
};

const useListRecords: UseAPI<typeof metaStore.RecordService.listRecords> = (
  token,
  { databaseId, ...query },
  shouldFetch = true
) => {
  const cacheQuery = objToQueryString({ ...query });
  const cacheKey = `${API_ROUTE.META.BASE}/databases/${databaseId}/records${cacheQuery}`;
  const listRecords = databaseId
    ? async () => {
        metaStore.OpenAPI.TOKEN = token;
        metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
        const listRecordsRes = await metaStore.RecordService.listRecords({
          databaseId,
          ...query,
        });
        return listRecordsRes;
      }
    : null;
  const swrRes = useSWR(
    shouldFetch && databaseId ? cacheKey : null,
    listRecords
  );
  return { ...swrRes, cacheKey };
};

const useListFiles: UseAPI<typeof metaStore.FileService.listFiles> = (
  token,
  { databaseId, recordId, ...query },
  shouldFetch = true
) => {
  const cacheKey = `${API_ROUTE.META.BASE}/databases/${databaseId}/records/${recordId}/files`;
  const fetcher = databaseId
    ? async () => {
        metaStore.OpenAPI.TOKEN = token;
        metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
        const res = await metaStore.FileService.listFiles({
          databaseId,
          recordId,
          ...query,
        });
        return res;
      }
    : null;
  const swrRes = useSWR(shouldFetch && databaseId ? cacheKey : null, fetcher);
  return { ...swrRes, cacheKey };
};

const useCreateJwtToDownloadFile: UseAPIWithoutCache<
  typeof fileProvider.DownloadService.createJwtToDownloadFile
> = (token, { requestBody }, shouldFetch = true) => {
  type StateType = {
    data:
      | AwaitType<
          ReturnType<
            typeof fileProvider.DownloadService.createJwtToDownloadFile
          >
        >
      | undefined;
    error: any;
  };

  const [res, setRes] = useState<StateType>({
    data: undefined,
    error: undefined,
  });

  useEffect(() => {
    if (shouldFetch) {
      fileProvider.OpenAPI.TOKEN = token;
      fileProvider.OpenAPI.BASE = API_ROUTE.FILE.BASE;
      fileProvider.DownloadService.createJwtToDownloadFile({
        requestBody,
      })
        .then((fetchRes) => {
          setRes({ data: fetchRes, error: undefined });
        })
        .catch((error) => {
          setRes({ data: undefined, error: error });
        });
    }
  }, [token, shouldFetch]);

  return res;
};

export {
  useListPermittedActions,
  useListDatabases,
  useGetConfig,
  fetchAPI,
  fetchMetaStore,
  fetchFileProvider,
  uploadFileToFileProvider,
  useGetRecord,
  useListRecords,
  useListFiles,
  useCreateJwtToDownloadFile,
};
