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
  deleteQueryString,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";

import StorageIcon from "@mui/icons-material/Storage";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { RenderToggleByAction } from "components/atoms/RenderToggleByAction";
import { Breadcrumbs } from "components/molecules/Breadcrumbs";
import { ControlledDatabaseMenuButton } from "components/organisms/ControlledDatabaseMenuButton";
import {
  DatabaseConfigModal,
  DatabaseConfigModalProps,
} from "components/organisms/DatabaseConfigModal";
import {
  RecordAddButton,
  RecordAddButtonProps,
} from "components/organisms/RecordAddButton";
import {
  RecordDetailModal,
  RecordDetailModalProps,
} from "components/organisms/RecordDetailModal";
import { RecordList, RecordListProps } from "components/organisms/RecordList";

import { RecordListMapView } from "components/organisms/RecordListMapView";
import { userActionsState, recordPaginateState } from "globalStates";
import {
  useListRecords,
  useGetConfig,
  useListPermittedActions,
  UserActionType,
  useGetDatabase,
} from "utils";

export type RecordsPagePresentationProps = {
  error?: ErrorMessageProps;
  searchText: SearchFormProps["defaultValue"];
  perPageOptions: PerPageSelectProps["values"];
  isFetchComplete: boolean;
  databaseId: string;
  databaseName?: string;
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
  onEndInitializeDatabase: DatabaseConfigModalProps["onClose"];
  listStyle: "map" | "table";
};

export const RecordsPagePresentation = ({
  error,
  searchText,
  perPage,
  perPageOptions,
  isFetchComplete,
  totalPage,
  page,
  databaseId,
  databaseName,
  addedRecordId,
  isNewDatabase,
  onChangeSearchText,
  onChangePerPage,
  onChangePage,
  onAddRecordSucceeded,
  onCloseRecordDetailModal,
  searchColumns,
  onEndInitializeDatabase,
  listStyle,
}: RecordsPagePresentationProps): JSX.Element => {
  return (
    <>
      <PageContainer>
        <PageBody>
          <PageToolBar
            left={
              <Breadcrumbs
                items={[
                  { link: "/", text: "Databases", icon: <StorageIcon /> },
                  { text: databaseName || databaseId },
                ]}
              />
            }
            right={
              <>
                {isFetchComplete ? (
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
                  </>
                ) : null}
                <ControlledDatabaseMenuButton databaseId={databaseId} />
              </>
            }
          />
          <PageMain>
            {error ? (
              <ErrorMessage {...error} />
            ) : isFetchComplete ? (
              listStyle === "table" ? (
                <RecordList
                  databaseId={databaseId}
                  page={page}
                  perPage={perPage}
                  search={searchText}
                  searchKey={searchColumns}
                />
              ) : listStyle === "map" ? (
                <RecordListMapView
                  databaseId={databaseId}
                  page={page}
                  perPage={perPage}
                  search={searchText}
                  searchKey={searchColumns}
                />
              ) : null
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
        <DatabaseConfigModal
          open
          databaseId={databaseId}
          onClose={onEndInitializeDatabase}
        />
      ) : null}
    </>
  );
};

type ParamType = { databaseId: string };

export const RecordsPage = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const { databaseId } = useParams<ParamType>();
  const [{ page, perPage, search, searchKey }, setRecordPaginateState] =
    useRecoilState(recordPaginateState);
  const setUserActions = useSetRecoilState(userActionsState);
  const [addedRecordId, serAddedRecordId] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);
  const [isNewDatabase, setIsNewDatabase] = useState(
    Boolean(getQueryString("new"))
  );

  const { data: getDatabaseRes } = useGetDatabase(getAccessToken, {
    databaseId,
  });
  const { data: getConfigRes, error: getConfigError } = useGetConfig(
    getAccessToken,
    {
      databaseId,
    }
  );

  const { data: listPermittedActionRes, error: listPermittedActionError } =
    useListPermittedActions(getAccessToken, { databaseId });

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
      const { reason, instruction } =
        extractErrorMessageFromFetchError(fetchError);
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  useEffect(() => {
    setRecordPaginateState((prev) => ({
      ...prev,
      page: Number(getQueryString("page")) || 1,
      perPage: Number(getQueryString("perPage")) || 20,
      search: getQueryString("search") || "",
      searchKey: getConfigRes?.columns
        .filter((column) => column.is_search_target)
        .map((column) => column.name) || ["record_id"],
    }));
  }, [getConfigRes, setRecordPaginateState, databaseId]);

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
    if (listPermittedActionRes) {
      setUserActions((listPermittedActionRes || []) as UserActionType[]);
    }
  }, [listPermittedActionRes, setUserActions]);

  const onAddRecordSucceeded: RecordsPagePresentationProps["onAddRecordSucceeded"] =
    (newRecord) => {
      serAddedRecordId(newRecord.record_id);
    };
  const onCloseRecordDetailModal = () => {
    serAddedRecordId(undefined);
    listRecordsMutate();
  };
  const onChangePage: RecordsPagePresentationProps["onChangePage"] = (page) =>
    setRecordPaginateState((prev) => ({ ...prev, page }));
  const onChangePerPage: RecordsPagePresentationProps["onChangePerPage"] = (
    perPage
  ) => {
    setRecordPaginateState((prev) => ({ ...prev, perPage, page: 1 }));
  };
  const onChangeSearchText: RecordsPagePresentationProps["onChangeSearchText"] =
    (searchText) => {
      setRecordPaginateState((prev) => ({
        ...prev,
        search: searchText || "",
        page: 1,
      }));
    };
  const onEndInitializeDatabase: RecordsPagePresentationProps["onEndInitializeDatabase"] =
    () => {
      setIsNewDatabase(false);
      deleteQueryString("new", "replace");
    };

  const isFetchComplete = Boolean(
    !fetchError && listRecordsRes && getConfigRes && listPermittedActionRes
  );
  const totalPage = listRecordsRes
    ? Math.ceil(listRecordsRes.total / listRecordsRes.per_page)
    : 0;
  const databaseName = getDatabaseRes?.name;

  const listStyle = getQueryString("listStyle") === "map" ? "map" : "table";

  return (
    <RecordsPagePresentation
      error={error}
      databaseId={databaseId || ""}
      databaseName={databaseName}
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
      listStyle={listStyle}
    />
  );
};
