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
  PerPageSelect,
} from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
import { DatabaseList } from "components/organisms/DatabaseList";
import { useEffect, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import { useHistory } from "react-router";
import { PageContainer } from "components/atoms/PageContainer";
import { PageToolBar } from "components/atoms/PageToolBar";
import { PageBody } from "components/atoms/PageBody";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";

const Page = (): JSX.Element => {
  const { getAccessTokenSilently } = useAuth0();
  const history = useHistory();
  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
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
  }, [page, perPage, searchText]);

  const onSelectDatabases = (database: metaStore.DatabaseModel) =>
    history.push(`/databases/${database.database_id}/records`);

  return (
    <PageContainer>
      <PageToolBar
        right={
          <>
            <SearchForm
              onSearch={(newSearchText) => setSearchText(newSearchText)}
              defaultValue={searchText}
            />
            <Spacer direction="horizontal" size="15px" />
            <PerPageSelect
              perPage={perPage}
              setPerPage={setPerPage}
              values={[10, 20, 50, 100]}
            />
          </>
        }
      />
      <PageBody>
        {listDatabasesError ? (
          <ErrorMessage
            reason={JSON.stringify(listDatabasesError)}
            instruction="please reload this page"
          />
        ) : listDatabasesRes ? (
          <DatabaseList
            databases={listDatabasesRes.data}
            onSelectDatabase={onSelectDatabases}
          />
        ) : (
          <LoadingIndicator />
        )}
      </PageBody>
      <Spacer direction="vertical" size="3vh" />
      {listDatabasesRes ? (
        <ElemCenteringFlexDiv>
          <Pagination
            count={Math.ceil(listDatabasesRes.number_of_pages)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
          />
        </ElemCenteringFlexDiv>
      ) : null}
    </PageContainer>
  );
};

export { Page as DatabasesPage };
