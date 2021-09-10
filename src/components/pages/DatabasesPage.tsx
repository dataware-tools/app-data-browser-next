import { useAuth0 } from "@auth0/auth0-react";
import {
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
  ErrorMessageProps,
  SearchFormProps,
  PerPageSelectProps,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import Pagination from "@material-ui/core/Pagination";
import StorageIcon from "@material-ui/icons/Storage";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { Breadcrumbs } from "components/molecules/Breadcrumbs";
import {
  DatabaseAddButton,
  DatabaseAddButtonProps,
} from "components/organisms/DatabaseAddButton";
import { DatabaseList } from "components/organisms/DatabaseList";
import { databasePaginateState } from "globalStates";
import { useListDatabases } from "utils";

export type DatabasesPagePresentationProps = {
  error?: ErrorMessageProps;
  searchText: SearchFormProps["defaultValue"];
  perPageOptions: PerPageSelectProps["values"];
  isFetchComplete: boolean;
  totalPage: number;
  page: number;
  perPage: PerPageSelectProps["perPage"];
  onChangeSearchText: SearchFormProps["onSearch"];
  onChangePerPage: PerPageSelectProps["setPerPage"];
  onChangePage: (newPage: number) => void;
  onAddDatabaseSucceeded: DatabaseAddButtonProps["onAddDatabaseSucceeded"];
};

export const DatabasesPagePresentation = ({
  error,
  searchText,
  perPage,
  perPageOptions,
  isFetchComplete,
  totalPage,
  page,
  onChangeSearchText,
  onChangePerPage,
  onChangePage,
  onAddDatabaseSucceeded,
}: DatabasesPagePresentationProps): JSX.Element => {
  return (
    <>
      <PageContainer>
        <PageBody>
          <PageToolBar
            left={
              <Breadcrumbs
                items={[{ text: "Databases", icon: <StorageIcon /> }]}
              />
            }
            right={
              isFetchComplete ? (
                <>
                  <SearchForm
                    onSearch={onChangeSearchText}
                    defaultValue={searchText}
                  />
                  <Spacer direction="horizontal" size="15px" />
                  <PerPageSelect
                    perPage={perPage}
                    setPerPage={onChangePerPage}
                    values={perPageOptions}
                  />
                  <Spacer direction="horizontal" size="15px" />
                  <DatabaseAddButton
                    onAddDatabaseSucceeded={onAddDatabaseSucceeded}
                  />
                </>
              ) : null
            }
          />
          <PageMain>
            {error ? (
              <ErrorMessage {...error} />
            ) : isFetchComplete ? (
              <DatabaseList page={page} perPage={perPage} search={searchText} />
            ) : (
              <LoadingIndicator />
            )}
          </PageMain>
          {isFetchComplete ? (
            <>
              <Spacer direction="vertical" size="3vh" />
              <ElemCenteringFlexDiv>
                <Pagination
                  count={totalPage}
                  page={page}
                  onChange={(_, newPage) => onChangePage(newPage)}
                />
              </ElemCenteringFlexDiv>
            </>
          ) : null}
        </PageBody>
      </PageContainer>
    </>
  );
};

export const DatabasesPage = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const history = useHistory();
  const [{ page, perPage, search }, setDatabasePaginateState] = useRecoilState(
    databasePaginateState
  );

  const {
    data: listDatabasesRes,
    error: listDatabasesError,
  } = useListDatabases(getAccessToken, { page, perPage, search });

  useEffect(() => {
    setDatabasePaginateState({
      page: Number(getQueryString("page")) || 1,
      perPage: Number(getQueryString("perPage")) || 20,
      search: getQueryString("search") || "",
      searchKey: [],
    });
  }, []);

  useEffect(() => {
    addQueryString({ page, perPage, search }, "replace");
  }, [page, perPage, search]);

  const onChangePage: DatabasesPagePresentationProps["onChangePage"] = (page) =>
    setDatabasePaginateState((prev) => ({ ...prev, page }));
  const onChangePerPage: DatabasesPagePresentationProps["onChangePerPage"] = (
    perPage
  ) => {
    setDatabasePaginateState((prev) => ({ ...prev, perPage }));
  };
  const onChangeSearchText: DatabasesPagePresentationProps["onChangeSearchText"] = (
    searchText
  ) => {
    setDatabasePaginateState((prev) => ({
      ...prev,
      search: searchText as string,
    }));
  };

  const onAddDatabaseSucceeded: DatabasesPagePresentationProps["onAddDatabaseSucceeded"] = (
    newDatabase
  ) => {
    history.push(`/databases/${newDatabase.database_id}/records?new=true`);
  };

  const error: DatabasesPagePresentationProps["error"] = listDatabasesError
    ? extractErrorMessageFromFetchError(listDatabasesError)
    : undefined;
  const isFetchComplete = Boolean(!error && listDatabasesRes);
  const totalPage = listDatabasesRes?.number_of_pages || 0;

  return (
    <DatabasesPagePresentation
      error={error}
      isFetchComplete={isFetchComplete}
      onChangePage={onChangePage}
      onChangePerPage={onChangePerPage}
      onChangeSearchText={onChangeSearchText}
      page={page}
      perPage={perPage}
      searchText={search}
      perPageOptions={[10, 20, 50, 100]}
      totalPage={totalPage}
      onAddDatabaseSucceeded={onAddDatabaseSucceeded}
    />
  );
};
