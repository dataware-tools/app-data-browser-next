import {
  metaStore,
  API_ROUTE,
  getQueryString,
  ObjToQueryString,
  addQueryString,
  ErrorMessage,
  LoadingIndicator,
  SearchForm,
  Spacer,
  ToolBar,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";

import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
import { DatabaseList } from "components/organisms/DatabaseList";
import { useEffect, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import { useHistory } from "react-router";

const useStyles = makeStyles(() => ({
  paginationContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  toolbarContainer: {
    overflow: "auto",
    padding: "3px",
  },
}));

const Page = (): JSX.Element => {
  const { getAccessTokenSilently } = useAuth0();
  const classes = useStyles();
  const history = useHistory();
  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  // @ts-expect-error foo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);

  const listDatabasesQuery = ObjToQueryString({
    page: page,
    per_page: perPage,
    search_text: searchText,
  });
  const URL = `${API_ROUTE.META.BASE}/databases${listDatabasesQuery}`;
  const fetchAPI = async () => {
    metaStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    const listDatabasesRes = await metaStore.DatabaseService.listDatabases(
      perPage,
      page,
      undefined,
      searchText
    );
    return listDatabasesRes;
  };
  const { data: listDatabasesRes, error: listDatabasesError } = useSWR(
    URL,
    fetchAPI
  );

  useEffect(() => {
    addQueryString({ page, perPage, searchText }, "replace");
  }, []);

  const onSelectDatabases = (database: metaStore.DatabaseModel) =>
    history.push(`/databases/${database.database_id}/records`);

  return (
    <div style={{ padding: "0 10vw" }}>
      <Spacer direction="vertical" size="3vh" />
      <div className={classes.toolbarContainer}>
        <ToolBar>
          <div style={{ flexShrink: 0 }}>
            <SearchForm
              onSearch={(newSearchText) => setSearchText(newSearchText)}
              defaultValue={searchText}
            />
          </div>
          <Spacer direction="horizontal" size="15px" />
          {/* <PerPageSelect perPage={perPage} setPerPage={setPerPage} /> */}
          <div style={{ flexShrink: 0 }}>| per page select |</div>
        </ToolBar>
      </div>
      <Spacer direction="vertical" size="3vh" />
      {listDatabasesError ? (
        <ErrorMessage
          reason={JSON.stringify(listDatabasesError)}
          instruction="please reload this page"
        />
      ) : listDatabasesRes ? (
        <>
          <DatabaseList
            databases={listDatabasesRes.data}
            onSelectDatabase={onSelectDatabases}
          />
          <Spacer direction="vertical" size="3vh" />
          <div className={classes.paginationContainer}>
            <Pagination
              count={Math.ceil(listDatabasesRes.number_of_pages)}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
            />
          </div>
        </>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
};

export { Page as DatabasesPage };
