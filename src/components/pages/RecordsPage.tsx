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
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";

import { useAuth0 } from "@auth0/auth0-react";
import { mutate } from "swr";
import { useEffect, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import { useParams } from "react-router";
import { RecordList, RecordListProps } from "components/organisms/RecordList";
import { RecordDetailModal } from "components/organisms/RecordDetailModal";
import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import { RecordEditModal } from "components/organisms/RecordEditModal";
import {
  DatabaseMenuButton,
  DatabaseMenuButtonProps,
} from "components/molecules/DatabaseMenuButton";
import {
  DatabaseConfigModal,
  DatabaseConfigNameType,
} from "components/organisms/DatabaseConfigModal";

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
import { useSetRecoilState } from "recoil";
import { userActionsState } from "../../globalStates";

const useStyles = makeStyles(() => ({
  fixedFlexShrink: {
    flexShrink: 0,
  },
}));

type ParamType = { databaseId: string };

const Page = (): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const classes = useStyles();
  const { databaseId } = useParams<ParamType>();

  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);

  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);
  const [isRecordEditModalOpen, setIsRecordEditModalOpen] = useState(false);
  const [
    editingConfigName,
    setEditingConfigName,
  ] = useState<DatabaseConfigNameType | null>(null);
  const [currentSelectedRecordId, setCurrentSelectedRecordId] = useState<
    string | null
  >(null);
  const [error, setError] = useState<
    { reason: string; instruction: string } | undefined
  >(undefined);

  const setUserActions = useSetRecoilState(userActionsState);

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

  const searchColumn = getConfigRes?.data_browser_config
    ?.record_search_config || ["record_id"];
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

  const displayColumns = getConfigRes?.data_browser_config?.record_display_config?.map(
    (value) => ({
      field: value,
      label: getConfigRes.columns.find((column) => column.name === value)
        ?.display_name,
    })
  );

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
      setIsRecordDetailModalOpen(true);
      setCurrentSelectedRecordId(listRecordsRes.data[record.index].record_id);
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

  const onDatabaseMenuSelect: DatabaseMenuButtonProps["onMenuSelect"] = (
    targetName
  ) => {
    switch (targetName) {
      case "Configure display columns":
        setEditingConfigName("record_display_config");
        break;
      case "Configure input columns":
        setEditingConfigName("record_input_config");
        break;
      case "Configure search target columns":
        setEditingConfigName("record_search_config");
        break;
      case "Configure secret columns":
        setEditingConfigName("secret_columns");
        break;
      case "Export metadata":
        setEditingConfigName("export_metadata");
        break;
      case "setting":
        setEditingConfigName("setting");
        break;
    }
  };

  const fetchError =
    listRecordsError || getConfigError || listPermittedActionError;

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
              <>
                {!listRecordsError ? (
                  <>
                    <div className={classes.fixedFlexShrink}>
                      <SearchForm
                        onSearch={(newSearchText) =>
                          setSearchText(newSearchText)
                        }
                        defaultValue={searchText}
                      />
                    </div>
                    <Spacer direction="horizontal" size="15px" />
                    <PerPageSelect
                      perPage={perPage}
                      setPerPage={setPerPage}
                      values={[10, 20, 50, 100]}
                    />
                    <Spacer direction="horizontal" size="15px" />
                    <Button
                      onClick={() => setIsRecordEditModalOpen(true)}
                      startIcon={<AddCircle />}
                      className={classes.fixedFlexShrink}
                    >
                      <TextCenteringSpan>Record</TextCenteringSpan>
                    </Button>
                  </>
                ) : null}
                {!getConfigError ? (
                  <>
                    <Spacer direction="horizontal" size="15px" />
                    <DatabaseMenuButton onMenuSelect={onDatabaseMenuSelect} />
                  </>
                ) : null}
              </>
            }
          />
          <PageMain>
            {fetchError || error ? (
              <ErrorMessage
                reason={JSON.stringify(fetchError || error)}
                instruction="please reload this page"
              />
            ) : listRecordsRes && getConfigRes ? (
              !displayColumns ? (
                <ErrorMessage
                  reason="Display columns is not configured"
                  instruction="please report administrator this error"
                />
              ) : (
                <RecordList
                  columns={displayColumns}
                  records={listRecordsRes.data}
                  onSelectRecord={onSelectRecord}
                  onDeleteRecord={onDeleteRecord}
                />
              )
            ) : (
              <LoadingIndicator />
            )}
          </PageMain>
          <Spacer direction="vertical" size="3vh" />
          {listRecordsRes ? (
            <ElemCenteringFlexDiv>
              <Pagination
                count={Math.ceil(
                  listRecordsRes.total / listRecordsRes.per_page
                )}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
              />
            </ElemCenteringFlexDiv>
          ) : null}
        </PageBody>
      </PageContainer>
      {listRecordsRes ? (
        <RecordEditModal
          open={isRecordEditModalOpen}
          onClose={() => setIsRecordEditModalOpen(false)}
          databaseId={databaseId}
          onSubmitSucceeded={(newRecord) => {
            const newRecordList = { ...listRecordsRes };
            newRecordList.data.push(newRecord);
            setCurrentSelectedRecordId(newRecord.record_id);
            setIsRecordDetailModalOpen(true);
          }}
          create
        />
      ) : null}
      {currentSelectedRecordId ? (
        <RecordDetailModal
          open={isRecordDetailModalOpen}
          recordId={currentSelectedRecordId}
          databaseId={databaseId}
          onClose={() => {
            setIsRecordDetailModalOpen(false);
            mutate(listRecordsCacheKey);
          }}
        />
      ) : null}
      {editingConfigName ? (
        <DatabaseConfigModal
          databaseId={databaseId}
          open={Boolean(editingConfigName)}
          onClose={() => setEditingConfigName(null)}
          configName={editingConfigName}
        />
      ) : null}
    </>
  );
};

export { Page as RecordsPage };
