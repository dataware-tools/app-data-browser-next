import {
  theme as themeInstance,
  databaseStore,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";

import { Button } from "@material-ui/core";

import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { mutate } from "swr";

type Props = {
  classes: ReturnType<typeof useStyles>;
  user: any;
  URL: string;
  error: any;
  data: any;
} & ContainerProps;

type ContainerProps = {
  sample: string;
};

const Component = ({
  classes,
  URL,
  user,
  error,
  data,
  sample,
}: Props): JSX.Element => {
  return (
    <div>
      <h1 className={classes.sample}>Hello {user ? user.name : "world"}</h1>
      <div>this is {sample}</div>
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

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  sample: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const apiUrlBase =
    process.env.NEXT_PUBLIC_BACKEND_API_PREFIX || "/api/latest";
  const { user, getAccessTokenSilently } = useAuth0();
  const fetchAPI = async () => {
    databaseStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    databaseStore.OpenAPI.BASE = apiUrlBase;
    const Res = await databaseStore.DatabaseService.listDatabases();
    return Res;
  };
  const URL = `${apiUrlBase}/databases`;
  const { data, error } = useSWR(URL, fetchAPI);
  const classes = useStyles();

  return (
    <Component
      classes={classes}
      user={user}
      data={data}
      error={error}
      URL={URL}
      {...delegated}
    />
  );
};

export { Container as Sample };
export type { ContainerProps as SampleProps };
