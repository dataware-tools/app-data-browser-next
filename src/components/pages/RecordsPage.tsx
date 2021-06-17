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
  DatabaseConfigButton,
  DatabaseConfigButtonProps,
} from "components/molecules/DatabaseConfigButton";
import {
  DatabaseConfigModal,
  DatabaseConfigNameType,
} from "components/organisms/DatabaseConfigModal";

import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { useListRecords, useGetConfig, DatabaseConfigType } from "utils";

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

  const [getConfigRes, getConfigError] = (useGetConfig(getAccessToken, {
    databaseId,
  }) as unknown) as [
    data: DatabaseConfigType | undefined,
    error: any,
    cacheKey: string
  ];

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

  const onSelectRecord: RecordListProps["onSelectRecord"] = (record) => {
    if (listRecordsRes) {
      setIsRecordDetailModalOpen(true);
      setCurrentSelectedRecordId(listRecordsRes.data[record.index].record_id);
    }
  };

  const databaseConfigMenu: DatabaseConfigButtonProps["menu"] = [
    {
      label: "Change input fields for record",
      value: "record_input_config",
    },
    {
      label: "Change display fields for record",
      value: "record_display_config",
    },
    {
      label: "Change search fields for record",
      value: "record_search_config",
    },
    {
      label: "Export metadata",
      value: "export_metadata",
    },
  ];
  const onSelectDatabaseConfig: DatabaseConfigButtonProps["onMenuSelect"] = (
    targetValue
  ) => {
    setEditingConfigName(targetValue);
  };

  const fetchError = listRecordsError || getConfigError;
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
                    <Spacer direction="horizontal" size="15px" />
                  </>
                ) : null}
                {!getConfigError ? (
                  <DatabaseConfigButton
                    onMenuSelect={onSelectDatabaseConfig}
                    menu={databaseConfigMenu}
                  />
                ) : null}
              </>
            }
          />
          <PageMain>
            {fetchError ? (
              <ErrorMessage
                reason={JSON.stringify(fetchError)}
                instruction="please reload this page"
              />
            ) : listRecordsRes && getConfigRes ? (
              !displayColumns ? (
                <ErrorMessage
                  reason="Display columns is not configured"
                  instruction="please report administrator this error"
                />
              ) : (
                <>
                  <RecordList
                    columns={displayColumns}
                    records={listRecordsRes.data}
                    onSelectRecord={onSelectRecord}
                  />
                </>
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
