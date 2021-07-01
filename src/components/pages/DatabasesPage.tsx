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
  ErrorMessageProps,
  SearchFormProps,
  PerPageSelectProps,
} from "@dataware-tools/app-common";
import { useAuth0 } from "@auth0/auth0-react";
import {
  DatabaseList,
  DatabaseListProps,
} from "components/organisms/DatabaseList";
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

type Props = {
  error?: ErrorMessageProps;
  searchText: SearchFormProps["defaultValue"];
  perPageOptions: PerPageSelectProps["values"];
  isFetchComplete: boolean;
  databases: DatabaseListProps["databases"];
  totalPage: number;
  page: number;
  isOpenDatabaseAddModal: boolean;
  perPage: PerPageSelectProps["perPage"];
  onChangeSearchText: SearchFormProps["onSearch"];
  onChangePerPage: PerPageSelectProps["setPerPage"];
  onOpenDatabaseAddModal: () => void;
  onSelectDatabase: DatabaseListProps["onSelectDatabase"];
  onChangePage: (newPage: number) => void;
  onCloseDatabaseAddModal: () => void;
  onAddDatabaseSucceeded: DatabaseAddModalProps["onSubmitSucceeded"];
};

const Component = ({
  error,
  searchText,
  perPage,
  perPageOptions,
  isFetchComplete,
  databases,
  totalPage,
  page,
  isOpenDatabaseAddModal,
  onChangeSearchText,
  onChangePerPage,
  onOpenDatabaseAddModal,
  onSelectDatabase,
  onChangePage,
  onCloseDatabaseAddModal,
  onAddDatabaseSucceeded,
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
                  <Button
                    onClick={onOpenDatabaseAddModal}
                    startIcon={<AddCircle />}
                  >
                    <TextCenteringSpan>Database</TextCenteringSpan>
                  </Button>
                </>
              ) : null
            }
          />
          <PageMain>
            {error ? (
              <ErrorMessage {...error} />
            ) : isFetchComplete ? (
              <DatabaseList
                databases={databases}
                onSelectDatabase={onSelectDatabase}
              />
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
      {isOpenDatabaseAddModal ? (
        <DatabaseAddModal
          open={isOpenDatabaseAddModal}
          onClose={onCloseDatabaseAddModal}
          onSubmitSucceeded={onAddDatabaseSucceeded}
        />
      ) : null}
    </>
  );
};

const Container = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const history = useHistory();

  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);
  const [isOpenDatabaseAddModal, setIsOpenDatabaseAddModal] = useState(false);
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

  const [
    listDatabasesRes,
    listDatabasesError,
    listDatabaseCacheKey,
  ] = useListDatabases(getAccessToken, { page, perPage, search: searchText });

  const fetchError = listDatabasesError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: JSON.stringify(fetchError),
        instruction: "Please reload this page",
      });
    }
  }, [fetchError]);

  useEffect(() => {
    addQueryString({ page, perPage, searchText }, "replace");
  }, [page, perPage, searchText]);

  const onSelectDatabase = (database: metaStore.DatabaseModel) =>
    history.push(`/databases/${database.database_id}/records`);

  const onAddDatabaseSucceeded: DatabaseAddModalProps["onSubmitSucceeded"] = () => {
    if (listDatabasesRes) {
      mutate(listDatabaseCacheKey);
    }
  };

  const onCloseDatabaseAddModal = () => setIsOpenDatabaseAddModal(false);
  const onOpenDatabaseAddModal = () => setIsOpenDatabaseAddModal(true);

  const databases = listDatabasesRes?.data || [];
  const isFetchComplete = Boolean(!fetchError && listDatabasesRes);
  const totalPage = listDatabasesRes?.number_of_pages || 0;
  return (
    <Component
      databases={databases}
      error={error}
      isFetchComplete={isFetchComplete}
      isOpenDatabaseAddModal={isOpenDatabaseAddModal}
      onAddDatabaseSucceeded={onAddDatabaseSucceeded}
      onChangePage={setPage}
      onChangePerPage={setPerPage}
      onChangeSearchText={setSearchText}
      onCloseDatabaseAddModal={onCloseDatabaseAddModal}
      onOpenDatabaseAddModal={onOpenDatabaseAddModal}
      onSelectDatabase={onSelectDatabase}
      page={page}
      perPage={perPage}
      searchText={searchText}
      perPageOptions={[10, 20, 50, 100]}
      totalPage={totalPage}
    />
  );
};

export { Container as DatabasesPage };
