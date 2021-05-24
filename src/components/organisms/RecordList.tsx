import { metaStore, Table, TableProps } from "@dataware-tools/app-common";

type Props = ContainerProps;

type ContainerProps = {
  records: metaStore.RecordModel[];
  onSelectRecord: TableProps["onClickRow"];
  columns: TableProps["columns"];
};

const Component = ({
  records,
  onSelectRecord,
  columns,
}: Props): JSX.Element => {
  return (
    <Table
      rows={records}
      // TODO: columns should passed by parent component to customize showing columns
      columns={columns}
      onClickRow={onSelectRecord}
      stickyHeader
      disableHoverCell
    />
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  return <Component {...delegated} />;
};

export { Container as RecordList };
export type { ContainerProps as RecordListProps };
