import { Redirect } from "react-router-dom";
import { APP_ROUTE } from "utils/index";

const Page = (): JSX.Element => {
  return <Redirect to={APP_ROUTE.DATABASE_LIST} />;
};

export { Page as IndexPage };
