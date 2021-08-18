import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { homepage } from "../../package.json";
import { DatabasesPage } from "components/pages/DatabasesPage";
import { IndexPage } from "components/pages/IndexPage";
import { RecordsPage } from "components/pages/RecordsPage";

const Page = (): JSX.Element | null => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <RecoilRoot>
      <Router basename={homepage}>
        <Switch>
          <Route exact path="/">
            <IndexPage />
          </Route>
          <Route exact path="/databases">
            <DatabasesPage />
          </Route>
          <Route exact path="/databases/:databaseId/records">
            <RecordsPage />
          </Route>
        </Switch>
      </Router>
    </RecoilRoot>
  );
};

export default Page;
