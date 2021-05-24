import {
  metaStore,
  API_ROUTE,
  getQueryString,
  ObjToQueryString,
  addQueryString,
  ErrorMessage,
  LoadingIndicator,
  SearchForm,
  Spacer,
  ToolBar,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";

import { useAuth0 } from "@auth0/auth0-react";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import { useParams } from "react-router";
import { RecordList, RecordListProps } from "components/organisms/RecordList";
import { RecordDetailModal } from "components/pages/RecordDetailModal";
import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import { RecordEditModal } from "./RecordEditModal";

const useStyles = makeStyles(() => ({
  paginationContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
}));

type ParamType = { databaseId: string };

const Page = (): JSX.Element => {
  const { getAccessTokenSilently } = useAuth0();
  const classes = useStyles();
  const { databaseId } = useParams<ParamType>();

  const [searchText, setSearchText] = useState(
    getQueryString("searchText") || ""
  );
  // @ts-expect-error foo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [perPage, setPerPage] = useState(
    Number(getQueryString("perPage")) || 20
  );
  const [page, setPage] = useState(Number(getQueryString("page")) || 1);

  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);
  const [isRecordEditModalOpen, setIsRecordEditModalOpen] = useState(false);
  const [currentSelectedRecordId, setCurrentSelectedRecordId] = useState<
    string | null
  >(null);

  const listRecordsQuery = ObjToQueryString({
    page: page,
    per_page: perPage,
    search_text: searchText,
  });
  const listRecordsURL = `${API_ROUTE.META.BASE}/databases/${databaseId}/records${listRecordsQuery}`;
  const listRecords = async () => {
    metaStore.OpenAPI.TOKEN = await getAccessTokenSilently();
    metaStore.OpenAPI.BASE = API_ROUTE.META.BASE;
    const listRecordsRes = await metaStore.RecordService.listRecords(
      databaseId,
      perPage,
      page,
      undefined,
      searchText
    );
    return listRecordsRes;
  };
  const { data: listRecordsRes, error: listRecordsError } = useSWR(
    listRecordsURL,
    listRecords
  );

  useEffect(() => {
    addQueryString({ page, perPage, searchText }, "replace");
  }, []);

  const onSelectRecord: RecordListProps["onSelectRecord"] = (record) => {
    if (listRecordsRes) {
      setIsRecordDetailModalOpen(true);
      setCurrentSelectedRecordId(listRecordsRes.data[record.index].record_id);
    }
  };

  return (
    <>
      <div style={{ padding: "0 10vw" }}>
        {listRecordsError ? (
          <ErrorMessage
            reason={JSON.stringify(listRecordsError)}
            instruction="please reload this page"
          />
        ) : listRecordsRes ? (
          <div>
            <Spacer direction="vertical" size="3vh" />
            <div style={{ overflow: "auto" }}>
              <ToolBar>
                <div style={{ flexShrink: 0 }}>
                  <SearchForm
                    onSearch={(newSearchText) => setSearchText(newSearchText)}
                    defaultValue={searchText}
                  />
                </div>
                <Spacer direction="horizontal" size="15px" />
                {/* <PerPageSelect perPage={perPage} setPerPage={setPerPage} /> */}
                <div style={{ flexShrink: 0 }}>| per page select |</div>
                <Spacer direction="horizontal" size="15px" />
                <Button
                  onClick={() => setIsRecordEditModalOpen(true)}
                  startIcon={<AddCircle />}
                  style={{ flexShrink: 0 }}
                >
                  <div style={{ paddingTop: "0.1rem" }}>Add Record</div>
                </Button>
              </ToolBar>
            </div>
            <Spacer direction="vertical" size="3vh" />
            <RecordList
              columns={[{ field: "record name" }, { field: "description" }]}
              records={listRecordsRes.data}
              onSelectRecord={onSelectRecord}
            />
            <Spacer direction="vertical" size="3vh" />
            <div className={classes.paginationContainer}>
              <Pagination
                count={Math.ceil(listRecordsRes.number_of_pages)}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
              />
            </div>
            {currentSelectedRecordId ? (
              <RecordDetailModal
                open={isRecordDetailModalOpen}
                recordId={currentSelectedRecordId}
                databaseId={databaseId}
                onClose={() => {
                  setIsRecordDetailModalOpen(false);
                  mutate(listRecordsURL);
                }}
              />
            ) : null}
            <RecordEditModal
              open={isRecordEditModalOpen}
              onClose={() => setIsRecordEditModalOpen(false)}
              databaseId={databaseId}
              onSaveSucceeded={(newRecord) => {
                const newRecordList = { ...listRecordsRes };
                newRecordList.data.push(newRecord);
                setCurrentSelectedRecordId(newRecord.record_id);
                setIsRecordDetailModalOpen(true);
              }}
            />
          </div>
        ) : (
          <LoadingIndicator />
        )}
      </div>
    </>
  );
};

export { Page as RecordsPage };
