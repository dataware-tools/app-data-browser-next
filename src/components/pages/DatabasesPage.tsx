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
} from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import { DatabaseList } from "components/organisms/DatabaseList";
import { useEffect } from "react";
import Pagination from "@material-ui/core/Pagination";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { useListDatabases } from "utils";
import { useRecoilState } from "recoil";
import { databasePaginateState } from "globalStates";
import { DatabaseAddButton } from "components/organisms/DatabaseAddButton";

type Props = {
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
};

const Component = ({
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
}: Props) => {
  return (
    <>
      <PageContainer>
        <PageBody>
          <PageToolBar
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
                  <DatabaseAddButton />
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

const Container = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
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
      search: getQueryString("searchText") || "",
      searchKey: [],
    });
  }, []);

  useEffect(() => {
    addQueryString({ page, perPage, search }, "replace");
  }, [page, perPage, search]);

  const onChangePage: Props["onChangePage"] = (page) =>
    setDatabasePaginateState((prev) => ({ ...prev, page }));
  const onChangePerPage: Props["onChangePerPage"] = (perPage) => {
    setDatabasePaginateState((prev) => ({ ...prev, perPage }));
  };
  const onChangeSearchText: Props["onChangeSearchText"] = (searchText) => {
    setDatabasePaginateState((prev) => ({ ...prev, search: searchText }));
  };

  const error: Props["error"] = listDatabasesError
    ? {
        reason: JSON.stringify(listDatabasesError),
        instruction: "Please reload this page",
      }
    : undefined;
  const isFetchComplete = Boolean(!error && listDatabasesRes);
  const totalPage = listDatabasesRes?.number_of_pages || 0;

  return (
    <Component
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
    />
  );
};

export { Container as DatabasesPage };
