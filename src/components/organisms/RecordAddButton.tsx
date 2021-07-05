import { TextCenteringSpan } from "@dataware-tools/app-common";
import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import {
  RecordEditModal,
  RecordEditModalProps,
} from "components/organisms/RecordEditModal";
import { useState } from "react";

type Props = {
  isOpenRecordAddModal: boolean;
  onOpenRecordAddModal: () => void;
  onCloseRecordAddModal: () => void;
} & ContainerProps;

type ContainerProps = {
  databaseId: string;
  onAddRecordSucceeded: RecordEditModalProps["onSubmitSucceeded"];
};

const Component = ({
  onOpenRecordAddModal,
  isOpenRecordAddModal,
  onCloseRecordAddModal,
  databaseId,
  onAddRecordSucceeded,
}: Props) => {
  return (
    <>
      <Button onClick={onOpenRecordAddModal} startIcon={<AddCircle />}>
        <TextCenteringSpan>Record</TextCenteringSpan>
      </Button>
      <RecordEditModal
        open={isOpenRecordAddModal}
        onClose={onCloseRecordAddModal}
        databaseId={databaseId}
        onSubmitSucceeded={onAddRecordSucceeded}
        create
      />
    </>
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const [isOpenRecordAddModal, setIsOpenRecordAddModal] = useState(false);

  const onOpenRecordAddModal = () => setIsOpenRecordAddModal(true);
  const onCloseRecordAddModal = () => setIsOpenRecordAddModal(false);
  return (
    <Component
      {...delegated}
      isOpenRecordAddModal={isOpenRecordAddModal}
      onOpenRecordAddModal={onOpenRecordAddModal}
      onCloseRecordAddModal={onCloseRecordAddModal}
    />
  );
};

export { Container as RecordAddButton };
export type { ContainerProps as RecordAddButtonProps };
