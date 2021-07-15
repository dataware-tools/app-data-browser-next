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
  deleteQueryString,
} from "@dataware-tools/app-common";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import { useParams } from "react-router";
import { RecordList, RecordListProps } from "components/organisms/RecordList";
import {
  RecordDetailModal,
  RecordDetailModalProps,
} from "components/organisms/RecordDetailModal";

import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import {
  useListRecords,
  useGetConfig,
  useListPermittedActions,
  UserActionType,
  extractReasonFromFetchError,
} from "utils";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userActionsState, recordPaginateState } from "globalStates";
import { RenderToggleByAction } from "components/atoms/RenderToggleByAction";
import { ControlledDatabaseMenuButton } from "components/organisms/ControlledDatabaseMenuButton";

import {
  DisplayConfigEditModal,
  DisplayConfigEditModalProps,
} from "components/organisms/DisplayConfigEditModal";
import {
  RecordAddButton,
  RecordAddButtonProps,
} from "components/organisms/RecordAddButton";
import { Breadcrumbs } from "components/molecules/Breadcrumbs";

type Props = {
  error?: ErrorMessageProps;
  searchText: SearchFormProps["defaultValue"];
  perPageOptions: PerPageSelectProps["values"];
  isFetchComplete: boolean;
  databaseId: string;
  searchColumns: RecordListProps["searchKey"];
  totalPage: number;
  page: number;
  perPage: PerPageSelectProps["perPage"];
  addedRecordId?: RecordDetailModalProps["recordId"];
  isNewDatabase: boolean;
  onChangeSearchText: SearchFormProps["onSearch"];
  onChangePerPage: PerPageSelectProps["setPerPage"];
  onChangePage: (newPage: number) => void;
  onAddRecordSucceeded: RecordAddButtonProps["onAddRecordSucceeded"];
  onCloseRecordDetailModal: RecordDetailModalProps["onClose"];
  onEndInitializeDatabase: DisplayConfigEditModalProps["onClose"];
};

const Component = ({
  error,
  searchText,
  perPage,
  perPageOptions,
  isFetchComplete,
  totalPage,
  page,
  databaseId,
  addedRecordId,
  isNewDatabase,
  onChangeSearchText,
  onChangePerPage,
  onChangePage,
  onAddRecordSucceeded,
  onCloseRecordDetailModal,
  searchColumns,
  onEndInitializeDatabase,
}: Props) => {
  return (
    <>
      <PageContainer>
        <PageBody>
          <PageToolBar
            left={
              <Breadcrumbs
                items={[
                  { link: "/", text: "Databases", iconName: "Storage" },
                  { text: databaseId },
                ]}
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
                  <RenderToggleByAction required="metadata:write:add">
                    <Spacer direction="horizontal" size="15px" />
                    <RecordAddButton
                      databaseId={databaseId}
                      onAddRecordSucceeded={onAddRecordSucceeded}
                    />
                  </RenderToggleByAction>
                  <Spacer direction="horizontal" size="15px" />
                  <ControlledDatabaseMenuButton databaseId={databaseId} />
                </>
              ) : null
            }
          />
          <PageMain>
            {error ? (
              <ErrorMessage {...error} />
            ) : isFetchComplete ? (
              <>
                <RecordList
                  databaseId={databaseId}
                  page={page}
                  perPage={perPage}
                  search={searchText}
                  searchKey={searchColumns}
                />
              </>
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
      {addedRecordId ? (
        <RecordDetailModal
          open={Boolean(addedRecordId)}
          recordId={addedRecordId}
          databaseId={databaseId}
          onClose={onCloseRecordDetailModal}
        />
      ) : null}
      {isNewDatabase ? (
        <DisplayConfigEditModal
          open
          databaseId={databaseId}
          onClose={onEndInitializeDatabase}
        />
      ) : null}
    </>
  );
};

type ParamType = { databaseId: string };

const Page = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const { databaseId } = useParams<ParamType>();
  const [
    { page, perPage, search, searchKey },
    setRecordPaginateState,
  ] = useRecoilState(recordPaginateState);
  const setUserActions = useSetRecoilState(userActionsState);
  const [addedRecordId, serAddedRecordId] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [isNewDatabase, setIsNewDatabase] = useState(
    Boolean(getQueryString("new"))
  );

  const { data: getConfigRes, error: getConfigError } = useGetConfig(
    getAccessToken,
    {
      databaseId,
    }
  );

  const {
    data: listPermittedActionRes,
    error: listPermittedActionError,
  } = useListPermittedActions(getAccessToken, { databaseId });

  const {
    data: listRecordsRes,
    error: listRecordsError,
    mutate: listRecordsMutate,
  } = useListRecords(
    getAccessToken,
    { databaseId, page, perPage, search, searchKey },
    Boolean(getConfigRes)
  );

  const fetchError =
    listRecordsError || getConfigError || listPermittedActionError;
  useEffect(() => {
    if (fetchError) {
      setError({
        reason: extractReasonFromFetchError(fetchError),
        instruction: "Please reload this page",
      });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  useEffect(() => {
    addQueryString(
      {
        page,
        perPage,
        search,
      },
      "replace"
    );
  }, [page, perPage, search]);

  useEffect(() => {
    setRecordPaginateState({
      page: Number(getQueryString("page")) || 1,
      perPage: Number(getQueryString("perPage")) || 20,
      search: getQueryString("searchText") || "",
      searchKey: getConfigRes?.columns
        .filter((column) => column.is_search_target)
        .map((column) => column.name) || ["record_id"],
    });
  }, [getConfigRes, setRecordPaginateState, databaseId]);

  useEffect(() => {
    if (listPermittedActionRes) {
      setUserActions((listPermittedActionRes || []) as UserActionType[]);
    }
  }, [listPermittedActionRes, setUserActions]);

  const onAddRecordSucceeded: Props["onAddRecordSucceeded"] = (newRecord) => {
    serAddedRecordId(newRecord.record_id);
  };
  const onCloseRecordDetailModal = () => {
    serAddedRecordId(undefined);
    listRecordsMutate();
  };
  const onChangePage: Props["onChangePage"] = (page) =>
    setRecordPaginateState((prev) => ({ ...prev, page }));
  const onChangePerPage: Props["onChangePerPage"] = (perPage) => {
    setRecordPaginateState((prev) => ({ ...prev, perPage }));
  };
  const onChangeSearchText: Props["onChangeSearchText"] = (searchText) => {
    setRecordPaginateState((prev) => ({ ...prev, search: searchText }));
  };
  const onEndInitializeDatabase: Props["onEndInitializeDatabase"] = () => {
    setIsNewDatabase(false);
    deleteQueryString("new", "replace");
  };

  const isFetchComplete = Boolean(
    !fetchError && listRecordsRes && getConfigRes && listPermittedActionRes
  );
  const totalPage = listRecordsRes
    ? Math.ceil(listRecordsRes.total / listRecordsRes.per_page)
    : 0;

  return (
    <Component
      error={error}
      databaseId={databaseId}
      isFetchComplete={isFetchComplete}
      onAddRecordSucceeded={onAddRecordSucceeded}
      onChangePage={onChangePage}
      onChangePerPage={onChangePerPage}
      onChangeSearchText={onChangeSearchText}
      onCloseRecordDetailModal={onCloseRecordDetailModal}
      page={page}
      perPage={perPage}
      perPageOptions={[10, 20, 50, 100]}
      searchText={search}
      addedRecordId={addedRecordId}
      totalPage={totalPage}
      searchColumns={searchKey}
      isNewDatabase={isNewDatabase}
      onEndInitializeDatabase={onEndInitializeDatabase}
    />
  );
};

export { Page as RecordsPage };
