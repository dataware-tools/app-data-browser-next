import { TextCenteringSpan } from "@dataware-tools/app-common";
import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import { useState } from "react";
import {
  RecordEditModal,
  RecordEditModalProps,
} from "components/organisms/RecordEditModal";

export type RecordAddButtonPresentationProps = {
  isOpenRecordAddModal: boolean;
  onOpenRecordAddModal: () => void;
  onCloseRecordAddModal: () => void;
} & RecordAddButtonProps;

export type RecordAddButtonProps = {
  databaseId: string;
  onAddRecordSucceeded: RecordEditModalProps["onSubmitSucceeded"];
};

export const RecordAddButtonPresentation = ({
  onOpenRecordAddModal,
  isOpenRecordAddModal,
  onCloseRecordAddModal,
  databaseId,
  onAddRecordSucceeded,
}: RecordAddButtonPresentationProps): JSX.Element => {
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

export const RecordAddButton = ({
  ...delegated
}: RecordAddButtonProps): JSX.Element => {
  const [isOpenRecordAddModal, setIsOpenRecordAddModal] = useState(false);

  const onOpenRecordAddModal = () => setIsOpenRecordAddModal(true);
  const onCloseRecordAddModal = () => setIsOpenRecordAddModal(false);
  return (
    <RecordAddButtonPresentation
      {...delegated}
      isOpenRecordAddModal={isOpenRecordAddModal}
      onOpenRecordAddModal={onOpenRecordAddModal}
      onCloseRecordAddModal={onCloseRecordAddModal}
    />
  );
};
