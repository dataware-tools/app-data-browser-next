import {
  getQueryString,
  addQueryString,
  ErrorMessage,
  LoadingIndicator,
  SearchForm,
  Spacer,
  PerPageSelect,
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
import { TextCenteringSpan } from "components/atoms/TextCenteringSpan";
import { PageContainer } from "components/atoms/PageContainer";
import { PageToolBar } from "components/atoms/PageToolBar";
import { PageBody } from "components/atoms/PageBody";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { useListRecords } from "utils";

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

  const [
    listRecordsRes,
    listRecordsError,
    listRecordsCacheKey,
  ] = useListRecords(getAccessToken, {
    databaseId,
    perPage,
    page,
    search: searchText,
  });

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
      value: "recordInputConfig",
    },
    {
      label: "Change display fields for record",
      value: "recordDisplayConfig",
    },
  ];
  const onSelectDatabaseConfig: DatabaseConfigButtonProps["onMenuSelect"] = (
    targetValue
  ) => {
    setEditingConfigName(targetValue);
  };

  return (
    <>
      <PageContainer>
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
              <div className={classes.fixedFlexShrink}>
                <SearchForm
                  onSearch={(newSearchText) => setSearchText(newSearchText)}
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
              <DatabaseConfigButton
                onMenuSelect={onSelectDatabaseConfig}
                menu={databaseConfigMenu}
              />
            </>
          }
        />
        <PageBody>
          {listRecordsError ? (
            <ErrorMessage
              reason={JSON.stringify(listRecordsError)}
              instruction="please reload this page"
            />
          ) : listRecordsRes ? (
            <>
              <RecordList
                columns={[{ field: "record name" }, { field: "description" }]}
                records={listRecordsRes.data}
                onSelectRecord={onSelectRecord}
              />
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
              />
              {editingConfigName ? (
                <DatabaseConfigModal
                  open={Boolean(editingConfigName)}
                  onClose={() => setEditingConfigName(null)}
                  configName={editingConfigName}
                />
              ) : null}
            </>
          ) : (
            <LoadingIndicator />
          )}
        </PageBody>
        <Spacer direction="vertical" size="3vh" />
        {listRecordsRes ? (
          <ElemCenteringFlexDiv>
            <Pagination
              count={Math.ceil(listRecordsRes.total / listRecordsRes.per_page)}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
            />
          </ElemCenteringFlexDiv>
        ) : null}
      </PageContainer>
    </>
  );
};

export { Page as RecordsPage };
