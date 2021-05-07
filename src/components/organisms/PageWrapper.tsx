import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuth0 } from "@auth0/auth0-react";

export type PageWrapperProps = {
  children: JSX.Element | JSX.Element[] | string;
};

export const PageWrapper = (props: PageWrapperProps): JSX.Element => {
  const { isLoading, error } = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  return (
    <div>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};
