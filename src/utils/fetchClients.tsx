import {
  API_ROUTE,
  metaStore,
  ObjToQueryString,
} from "@dataware-tools/app-common";
import useSWR from "swr";
import { AwaitType } from "./utilTypes";

type Data<T> = T extends void | undefined | null
  ? "__fetchSuccess__" | undefined
  : T | undefined;

const fetchAPI = async <T, U>(
  token: string | (() => Promise<string>),
  fetcher: (args: T) => Promise<U>,
  param: T
): Promise<[data: Data<U>, error: any]> => {
  metaStore.OpenAPI.TOKEN = token;
  metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;

  try {
    const res = await fetcher(param);
    // See: https://miyauchi.dev/ja/posts/typescript-conditional-types#%E5%9E%8B%E5%AE%9A%E7%BE%A9%E3%81%A8-conditional-types
    return [(res || "__fetchSuccess__") as Data<U>, undefined];
  } catch (error) {
    return [undefined as Data<U>, error];
  }
};

interface UseAPI<T extends (...args: any) => Promise<any>> {
  (
    token: string | (() => Promise<string>),
    param: Partial<Parameters<T>[number]>,
    shouldFetch?: boolean
  ): [data: AwaitType<ReturnType<T>> | undefined, error: any, cacheKey: string];
}

const useListDatabases: UseAPI<
  typeof metaStore.DatabaseService.listDatabases
> = (token, { ...query }, shouldFetch = true) => {
  const cacheQuery = ObjToQueryString({ ...query });
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
  const cacheQuery = ObjToQueryString({ ...query });
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

export {
  useListDatabases,
  fetchAPI,
  useGetRecord,
  useListRecords,
  useListFiles,
};
