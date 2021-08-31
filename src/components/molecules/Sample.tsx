import { useAuth0 } from "@auth0/auth0-react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { mutate } from "swr";
import { useListDatabases } from "utils/index";

export type SamplePresentationProps = {
  user: any;
  onRevalidate: () => void;
  error: any;
  data: any;
} & SampleProps;

export type SampleProps = {
  sample: string;
};

export const SamplePresentation = ({
  onRevalidate,
  user,
  error,
  data,
  sample,
}: SamplePresentationProps): JSX.Element => {
  return (
    <div>
      <Typography
        variant="h3"
        sx={{ ":hover": { backgroundColor: "action.hover" } }}
      >
        Hello {user ? user.name : "world"}
      </Typography>
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

export const Sample = ({ ...delegated }: SampleProps): JSX.Element => {
  const { user, getAccessTokenSilently: getAccessToken } = useAuth0();
  const { data, error, cacheKey } = useListDatabases(getAccessToken, {});
  const onRevalidate = () => {
    mutate(cacheKey);
  };

  return (
    <SamplePresentation
      user={user}
      data={data}
      error={error}
      onRevalidate={onRevalidate}
      {...delegated}
    />
  );
};
