import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  ErrorMessage,
  ErrorMessageProps,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import { Map, MapProps, Marker, ZoomControl } from "pigeon-maps";
import { useState, useEffect } from "react";
import { RecordDetailModal } from "./RecordDetailModal";
import { ParamTypeListRecords, useListRecords } from "utils";

type RecordForMapViewType = metaStore.RecordModel & {
  __dataBrowserRecordListMapView: { lat: number; lon: number };
};

export type RecordListMapViewPresentationProps = {
  error?: ErrorMessageProps;
  selectedRecordId?: string;
  onSelectRecord: (record: RecordForMapViewType) => void;
  onCloseRecordDetailModal: () => void;
  records: RecordForMapViewType[];
  mapProps?: MapProps;
} & Pick<RecordListMapViewProps, "databaseId">;

export type RecordListMapViewProps = ParamTypeListRecords;

export const RecordListMapViewPresentation = ({
  error,
  records,
  onSelectRecord,
  databaseId,
  selectedRecordId,
  onCloseRecordDetailModal,
  mapProps,
}: RecordListMapViewPresentationProps): JSX.Element => {
  return error ? (
    <ErrorMessage {...error} />
  ) : records.length <= 0 ? (
    <ErrorMessage reason="No invalid records" />
  ) : (
    <>
      <Map {...mapProps}>
        {records.map((record) => {
          const latlon = record.__dataBrowserRecordListMapView;
          return (
            <Marker
              key={record.record_id}
              anchor={[latlon.lat, latlon.lon]}
              onClick={() => onSelectRecord(record)}
            />
          );
        })}
        <ZoomControl />
      </Map>
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

export const RecordListMapView = ({
  databaseId,
  page,
  perPage,
  search,
  searchKey,
}: RecordListMapViewProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<
    RecordListMapViewPresentationProps["error"] | undefined
  >(undefined);

  const {
    data: listRecordsRes,
    error: listRecordsError,
    mutate: listRecordsMutate,
  } = useListRecords(getAccessToken, {
    databaseId,
    page,
    perPage,
    search,
    searchKey,
  });

  const fetchError = listRecordsError;
  useEffect(() => {
    if (fetchError) {
      const { reason, instruction } =
        extractErrorMessageFromFetchError(fetchError);
      setError({ reason, instruction });
    } else {
      setError(undefined);
    }
  }, [fetchError]);

  const onSelectRecord: RecordListMapViewPresentationProps["onSelectRecord"] = (
    record: any
  ) => {
    if (listRecordsRes) {
      setSelectedRecordId(String(record.record_id));
    }
  };

  const onCloseRecordDetailModal = () => {
    setSelectedRecordId(undefined);
    listRecordsMutate();
  };

  const records =
    listRecordsRes?.data
      .filter(
        (record) =>
          record?.contents["/awapi/vehicle/get/status"]?.statistics?.latlon?.lat
            ?.mean &&
          record?.contents["/awapi/vehicle/get/status"]?.statistics?.latlon?.lon
            ?.mean
      )
      .map((record) => {
        const rawLat =
          record.contents["/awapi/vehicle/get/status"].statistics.latlon.lat
            .mean;
        const rawLon =
          record.contents["/awapi/vehicle/get/status"].statistics.latlon.lon
            .mean;
        const lat = typeof rawLat === "number" ? rawLat : parseFloat(rawLat);
        const lon = typeof rawLon === "number" ? rawLon : parseFloat(rawLon);
        return {
          ...record,
          __dataBrowserRecordListMapView: { lat: lat, lon: lon },
        };
      }) || [];

  const mapProps: RecordListMapViewPresentationProps["mapProps"] = {
    defaultCenter: records[0]
      ? [
          records[0].__dataBrowserRecordListMapView.lat,
          records[0].__dataBrowserRecordListMapView.lon,
        ]
      : [137, 36],
    defaultZoom: 10,
  };

  return (
    <RecordListMapViewPresentation
      error={error}
      records={records}
      databaseId={databaseId}
      onSelectRecord={onSelectRecord}
      onCloseRecordDetailModal={onCloseRecordDetailModal}
      selectedRecordId={selectedRecordId}
      mapProps={mapProps}
    />
  );
};
