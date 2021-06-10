import {
  API_ROUTE,
  fileProvider,
  metaStore,
  objToQueryString,
} from "@dataware-tools/app-common";
import useSWR from "swr";
import { AwaitType } from "./utilTypes";
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
  metaStore.OpenAPI.TOKEN = token;
  return await fetchAPI(fetcher, param);
};

interface UseAPI<T extends (...args: any) => Promise<any>> {
  (
    token: string | (() => Promise<string>),
    param: Partial<Parameters<T>[number]>,
    shouldFetch?: boolean
  ): [data: AwaitType<ReturnType<T>> | undefined, error: any, cacheKey: string];
}

interface UseAPIWithoutCache<T extends (...args: any) => Promise<any>> {
  (...args: Parameters<UseAPI<T>>): [
    ReturnType<UseAPI<T>>[0],
    ReturnType<UseAPI<T>>[1]
  ];
}

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
  // See: https://swr.vercel.app/docs/conditional-fetching
  const { data, error } = useSWR(shouldFetch ? cacheKey : null, fetcher);
  return [data, error, cacheKey];
};

const useGetConfig: UseAPI<typeof metaStore.ConfigService.getConfig> = (
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

  const { data, error } = useSWR(
    shouldFetch && databaseId ? cacheKey : null,
    fetcher
  );
  return [data, error, cacheKey];
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

  const { data, error } = useSWR(
    shouldFetch && databaseId && recordId ? cacheKey : null,
    fetcher
  );
  return [data, error, cacheKey];
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
  const { data, error } = useSWR(
    shouldFetch && databaseId ? cacheKey : null,
    listRecords
  );
  return [data, error, cacheKey];
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
  const { data, error } = useSWR(
    shouldFetch && databaseId ? cacheKey : null,
    fetcher
  );
  return [data, error, cacheKey];
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

  return [res.data, res.error];
};

export {
  useListDatabases,
  useGetConfig,
  fetchAPI,
  fetchMetaStore,
  fetchFileProvider,
  useGetRecord,
  useListRecords,
  useListFiles,
  useCreateJwtToDownloadFile,
};
