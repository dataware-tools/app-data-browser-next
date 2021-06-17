import {
  metaStore,
  getQueryString,
  addQueryString,
  ErrorMessage,
  LoadingIndicator,
  SearchForm,
  Spacer,
  PerPageSelect,
  PageContainer,
  PageToolBar,
  PageBody,
  PageMain,
  TextCenteringSpan,
} from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import { DatabaseList } from "components/organisms/DatabaseList";
import { useEffect, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import { useHistory } from "react-router";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { useListDatabases } from "utils";
import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import {
  DatabaseAddModal,
  DatabaseAddModalProps,
} from "components/organisms/DatabaseAddModal";
import { mutate } from "swr";

const Page = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const history = useHistory();

  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);

  const [isDatabaseAddModalOpen, setIsDatabaseAddModalOpen] = useState(false);

  const [
    listDatabasesRes,
    listDatabasesError,
    listDatabaseCacheKey,
  ] = useListDatabases(getAccessToken, { page, perPage, search: searchText });

  useEffect(() => {
    addQueryString({ page, perPage, searchText }, "replace");
  }, [page, perPage, searchText]);

  const onSelectDatabases = (database: metaStore.DatabaseModel) =>
    history.push(`/databases/${database.database_id}/records`);

  const onAddDatabaseSucceeded: DatabaseAddModalProps["onSubmitSucceeded"] = () => {
    if (listDatabasesRes) {
      mutate(listDatabaseCacheKey);
    }
  };

  return (
    <>
      <PageContainer>
        <PageBody>
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
                <Spacer direction="horizontal" size="15px" />
                <Button
                  onClick={() => setIsDatabaseAddModalOpen(true)}
                  startIcon={<AddCircle />}
                >
                  <TextCenteringSpan>Database</TextCenteringSpan>
                </Button>
              </>
            }
          />
          <PageMain>
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
          </PageMain>
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
        </PageBody>
      </PageContainer>
      {isDatabaseAddModalOpen ? (
        <DatabaseAddModal
          open={isDatabaseAddModalOpen}
          onClose={() => setIsDatabaseAddModalOpen(false)}
          onSubmitSucceeded={onAddDatabaseSucceeded}
        />
      ) : null}
    </>
  );
};

export { Page as DatabasesPage };
