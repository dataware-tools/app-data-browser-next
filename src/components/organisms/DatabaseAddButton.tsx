import { TextCenteringSpan } from "@dataware-tools/app-common";
import AddCircle from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import { useState } from "react";
import {
  DatabaseEditModal,
  DatabaseEditModalProps,
} from "components/organisms/DatabaseEditModal";

export type DatabaseAddButtonPresentationProps = {
  isOpenDatabaseAddModal: boolean;
  onOpenDatabaseAddModal: () => void;
  onCloseDatabaseAddModal: () => void;
} & DatabaseAddButtonProps;

export type DatabaseAddButtonProps = {
  onAddDatabaseSucceeded?: DatabaseEditModalProps<true>["onSubmitSucceeded"];
};

export const DatabaseAddButtonPresentation = ({
  onOpenDatabaseAddModal,
  isOpenDatabaseAddModal,
  onCloseDatabaseAddModal,
  onAddDatabaseSucceeded,
}: DatabaseAddButtonPresentationProps): JSX.Element => {
  return (
    <>
      <Button onClick={onOpenDatabaseAddModal} startIcon={<AddCircle />}>
        <TextCenteringSpan>Database</TextCenteringSpan>
      </Button>
      <DatabaseEditModal
        add
        open={isOpenDatabaseAddModal}
        onClose={onCloseDatabaseAddModal}
        onSubmitSucceeded={onAddDatabaseSucceeded}
      />
    </>
  );
};

export const DatabaseAddButton = ({
  ...delegated
}: DatabaseAddButtonProps): JSX.Element => {
  const [isOpenDatabaseAddModal, setIsOpenDatabaseAddModal] = useState(false);

  const onOpenDatabaseAddModal = () => setIsOpenDatabaseAddModal(true);
  const onCloseDatabaseAddModal = () => setIsOpenDatabaseAddModal(false);
  return (
    <DatabaseAddButtonPresentation
      {...delegated}
      isOpenDatabaseAddModal={isOpenDatabaseAddModal}
      onOpenDatabaseAddModal={onOpenDatabaseAddModal}
      onCloseDatabaseAddModal={onCloseDatabaseAddModal}
    />
  );
};
