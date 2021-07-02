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
  TextCenteringSpan,
  PageMain,
  fetchMetaStore,
  metaStore,
  confirm,
  ErrorMessageProps,
  SearchFormProps,
  PerPageSelectProps,
} from "@dataware-tools/app-common";

import { useAuth0 } from "@auth0/auth0-react";
import { mutate } from "swr";
import { useEffect, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import { useParams } from "react-router";
import { RecordList, RecordListProps } from "components/organisms/RecordList";
import {
  RecordDetailModal,
  RecordDetailModalProps,
} from "components/organisms/RecordDetailModal";
import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import {
  RecordEditModal,
  RecordEditModalProps,
} from "components/organisms/RecordEditModal";

import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import {
  useListRecords,
  useGetConfig,
  DatabaseConfigType,
  useListPermittedActions,
  UserActionType,
} from "utils";
import { produce } from "immer";
import { useRecoilState } from "recoil";
import { userActionsState } from "../../globalStates";
import { RenderToggleByAction } from "../atoms/RenderToggleByAction";
import { ControlledDatabaseMenuButton } from "components/organisms/ControlledDatabaseMenuButton";

type Props = {
  error?: ErrorMessageProps;
  searchText: SearchFormProps["defaultValue"];
  perPageOptions: PerPageSelectProps["values"];
  isFetchComplete: boolean;
  records: RecordListProps["records"];
  databaseId: RecordEditModalProps["databaseId"];
  totalPage: number;
  page: number;
  isOpenRecordAddModal: boolean;
  perPage: PerPageSelectProps["perPage"];
  displayColumns: RecordListProps["columns"];
  selectedRecordId?: RecordDetailModalProps["recordId"];
  onChangeSearchText: SearchFormProps["onSearch"];
  onChangePerPage: PerPageSelectProps["setPerPage"];
  onOpenRecordAddModal: () => void;
  onSelectRecord: RecordListProps["onSelectRecord"];
  onChangePage: (newPage: number) => void;
  onCloseRecordAddModal: () => void;
  onAddRecordSucceeded: RecordEditModalProps["onSubmitSucceeded"];
  onDeleteRecord: RecordListProps["onDeleteRecord"];
  onCloseRecordDetailModal: RecordDetailModalProps["onClose"];
};

const Component = ({
  error,
  searchText,
  perPage,
  perPageOptions,
  isFetchComplete,
  records,
  totalPage,
  page,
  isOpenRecordAddModal,
  databaseId,
  displayColumns,
  selectedRecordId,
  onChangeSearchText,
  onChangePerPage,
  onOpenRecordAddModal,
  onSelectRecord,
  onChangePage,
  onCloseRecordAddModal,
  onAddRecordSucceeded,
  onDeleteRecord,
  onCloseRecordDetailModal,
}: Props) => {
  return (
    <>
      <PageContainer>
        <PageBody>
          <PageToolBar
            left={
              <Link to="/">
                <ElemCenteringFlexDiv>
                  <HomeIcon />
                  Home
                </ElemCenteringFlexDiv>
              </Link>
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
                    <Button
                      onClick={onOpenRecordAddModal}
                      startIcon={<AddCircle />}
                    >
                      <TextCenteringSpan>Record</TextCenteringSpan>
                    </Button>
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
              <RecordList
                columns={displayColumns}
                records={records}
                onSelectRecord={onSelectRecord}
                onDeleteRecord={onDeleteRecord}
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
      {isOpenRecordAddModal ? (
        <RecordEditModal
          open={isOpenRecordAddModal}
          onClose={onCloseRecordAddModal}
          databaseId={databaseId}
          onSubmitSucceeded={onAddRecordSucceeded}
          create
        />
      ) : null}
      {selectedRecordId ? (
        <RecordDetailModal
          open={Boolean(selectedRecordId)}
          recordId={selectedRecordId}
          databaseId={databaseId}
          onClose={onCloseRecordDetailModal}
        />
      ) : null}
    </>
  );
};

type ParamType = { databaseId: string };

const Page = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const { databaseId } = useParams<ParamType>();
  const [userActions, setUserActions] = useRecoilState(userActionsState);

  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);
  const [isOpenRecordAddModal, setIsOpenRecordAddModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<ErrorMessageProps | undefined>(undefined);

  const [getConfigRes, getConfigError] = (useGetConfig(getAccessToken, {
    databaseId,
  }) as unknown) as [
    data: DatabaseConfigType | undefined,
    error: any,
    cacheKey: string
  ];

  const [
    listPermittedActionRes,
    listPermittedActionError,
  ] = useListPermittedActions(getAccessToken, { databaseId });

  const searchColumn = getConfigRes?.columns
    .filter((column) => column.is_search_target)
    .map((column) => column.name) || ["record_id"];

  const [
    listRecordsRes,
    listRecordsError,
    listRecordsCacheKey,
  ] = useListRecords(getAccessToken, {
    databaseId,
    perPage,
    page,
    search: searchText,
    searchKey: searchColumn,
  });

  const fetchError =
    listRecordsError || getConfigError || listPermittedActionError;
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

  useEffect(() => {
    if (listPermittedActionRes) {
      setUserActions(listPermittedActionRes as UserActionType[]);
    }
  }, [listPermittedActionRes, setUserActions]);

  const onSelectRecord: RecordListProps["onSelectRecord"] = (record) => {
    if (listRecordsRes) {
      setSelectedRecordId(listRecordsRes.data[record.index].record_id);
    }
  };

  const onDeleteRecord: RecordListProps["onDeleteRecord"] = async (target) => {
    if (listRecordsRes) {
      if (
        !(await confirm({ title: "Are you sure you want to delete record?" }))
      ) {
        return;
      }

      const newRecordList = produce(listRecordsRes, (draft) => {
        draft.data.splice(target.index, 1);
      });
      mutate(listRecordsCacheKey, newRecordList, false);

      const [deleteRecordRes, deleteRecordError] = await fetchMetaStore(
        getAccessToken,
        metaStore.RecordService.deleteRecord,
        {
          databaseId,
          recordId: listRecordsRes.data[target.index].record_id,
        }
      );

      if (deleteRecordError) {
        setError({
          reason: JSON.stringify(deleteRecordError),
          instruction: "Please reload this page",
        });
      } else if (deleteRecordRes) {
        mutate(listRecordsCacheKey);
      }
    }
  };

  const onAddRecordSucceeded: Props["onAddRecordSucceeded"] = (newRecord) => {
    if (listRecordsRes) {
      const newRecordList = { ...listRecordsRes };
      newRecordList.data.push(newRecord);
      setSelectedRecordId(newRecord.record_id);
    }
  };

  const onOpenRecordAddModal = () => setIsOpenRecordAddModal(true);
  const onCloseRecordAddModal = () => setIsOpenRecordAddModal(false);

  const onCloseRecordDetailModal = () => {
    setSelectedRecordId(undefined);
    mutate(listRecordsCacheKey);
  };

  const displayColumns =
    getConfigRes?.columns
      .filter((column) => column.is_display_field)
      .map((column) => ({
        field: column.name,
        label: column.display_name,
      })) || [];
  const records = listRecordsRes?.data || [];
  const isFetchComplete = Boolean(
    !fetchError && listRecordsRes && getConfigRes && listPermittedActionRes
  );
  const totalPage = listRecordsRes
    ? Math.ceil(listRecordsRes.total / listRecordsRes.per_page)
    : 0;
  const isPermittedDeleteRecord = userActions.some((action) =>
    "metadata:write:delete".startsWith(action)
  );

  return (
    <Component
      error={error}
      databaseId={databaseId}
      displayColumns={displayColumns}
      isFetchComplete={isFetchComplete}
      isOpenRecordAddModal={isOpenRecordAddModal}
      onAddRecordSucceeded={onAddRecordSucceeded}
      onChangePage={setPage}
      onChangePerPage={setPerPage}
      onChangeSearchText={setSearchText}
      onCloseRecordAddModal={onCloseRecordAddModal}
      onCloseRecordDetailModal={onCloseRecordDetailModal}
      onDeleteRecord={isPermittedDeleteRecord ? onDeleteRecord : undefined}
      onOpenRecordAddModal={onOpenRecordAddModal}
      onSelectRecord={onSelectRecord}
      page={page}
      perPage={perPage}
      perPageOptions={[10, 20, 50, 100]}
      records={records}
      searchText={searchText}
      selectedRecordId={selectedRecordId}
      totalPage={totalPage}
    />
  );
};

export { Page as RecordsPage };
