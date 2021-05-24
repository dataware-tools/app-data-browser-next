import { DatabasesPage } from "components/pages/DatabasesPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { IndexPage } from "components/pages/IndexPage";
import { homepage } from "../../package.json";
import { useEffect, useState } from "react";
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
  );
};

export default Page;
