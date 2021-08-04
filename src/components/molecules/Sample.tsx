import { theme as themeInstance } from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import { useAuth0 } from "@auth0/auth0-react";
import { mutate } from "swr";
import { useListDatabases } from "utils/index";

type Props = {
  classes: ReturnType<typeof useStyles>;
  user: any;
  onRevalidate: () => void;
  error: any;
  data: any;
} & ContainerProps;

type ContainerProps = {
  sample: string;
};

const Component = ({
  classes,
  onRevalidate,
  user,
  error,
  data,
  sample,
}: Props): JSX.Element => {
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

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  sample: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const classes = useStyles();
  const { user, getAccessTokenSilently: getAccessToken } = useAuth0();
  const { data, error, cacheKey } = useListDatabases(getAccessToken, {});
  const onRevalidate = () => {
    mutate(cacheKey);
  };

  return (
    <Component
      classes={classes}
      user={user}
      data={data}
      error={error}
      onRevalidate={onRevalidate}
      {...delegated}
    />
  );
};

export { Container as Sample };
export type { ContainerProps as SampleProps };
