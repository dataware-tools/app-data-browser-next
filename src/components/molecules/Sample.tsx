import { theme as themeInstance } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import { useAuth0 } from "@auth0/auth0-react";
import { mutate } from "swr";
import { useListDatabases } from "utils/index";

export type SampleDOMProps = {
  user: any;
  onRevalidate: () => void;
  error: any;
  data: any;
} & SampleProps;

export type SampleProps = {
  sample: string;
};

export const useStyles = makeStyles((theme: typeof themeInstance) => ({
  sample: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export const SampleDOM = (props: SampleDOMProps): JSX.Element => {
  const { onRevalidate, user, error, data, sample } = props;
  const classes = useStyles();
  return (
    <div>
      <h1 className={classes.sample}>Hello {user ? user.name : "world"}</h1>
      <div>this is {sample}</div>
      <Button onClick={onRevalidate}>revalidate API</Button>
      {error ? (
        <div>error: {JSON.stringify(error)}</div>
      ) : data ? (
        <div>data: {JSON.stringify(data)}</div>
      ) : null}
    </div>
  );
};

export const Sample = (props: SampleProps): JSX.Element => {
  const { ...delegated } = props;
  const { user, getAccessTokenSilently: getAccessToken } = useAuth0();
  const { data, error, cacheKey } = useListDatabases(getAccessToken, {});
  const onRevalidate = () => {
    mutate(cacheKey);
  };

  return (
    <SampleDOM
      user={user}
      data={data}
      error={error}
      onRevalidate={onRevalidate}
      {...delegated}
    />
  );
};
