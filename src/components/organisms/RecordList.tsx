import { metaStore, Table, TableProps } from "@dataware-tools/app-common";

type Props = ContainerProps;

type ContainerProps = {
  records: metaStore.RecordModel[];
  onClickRow: TableProps["onClickRow"];
};

const Component = ({ records, onClickRow }: Props): JSX.Element => {
  return (
    <Table
      rows={records}
      // columns should passed by parent component to customize showing columns
      columns={[{ field: "record_id" }, { field: "description" }]}
      onClickRow={onClickRow}
      stickyHeader
    />
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  return <Component {...delegated} />;
};

export { Container as RecordList };
export type { ContainerProps as RecordListProps };
