import { Navigate } from "react-router-dom";
import { APP_ROUTE } from "utils/index";

const Page = (): JSX.Element => {
  return <Navigate to={APP_ROUTE.DATABASE_LIST} replace />;
};

export { Page as IndexPage };
