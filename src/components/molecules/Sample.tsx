import { databaseStore } from "@dataware-tools/app-common";
import { Button } from "@material-ui/core";

import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { mutate } from "swr";

const apiUrlBase = process.env.NEXT_PUBLIC_BACKEND_API_PREFIX || "/api/latest";

const Sample = (): JSX.Element => {
  const { user, getAccessTokenSilently } = useAuth0();
  const fetchAPI = async () => {
    databaseStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    databaseStore.OpenAPI.BASE = apiUrlBase;
    const Res = await databaseStore.DatabaseService.listDatabases();
    return Res;
  };
  const URL = `${apiUrlBase}/databases`;
  const { data, error } = useSWR(URL, fetchAPI);

  return (
    <div>
      <h1>Hello {user ? user.name : "world"}</h1>
      <Button
        onClick={() => {
          mutate(URL);
        }}
      >
        revalidate API
      </Button>
      {error ? (
        <div>error: {JSON.stringify(error)}</div>
      ) : data ? (
        <div>data: {JSON.stringify(data)}</div>
      ) : null}
    </div>
  );
};

export { Sample };
