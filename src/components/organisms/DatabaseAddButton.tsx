import { TextCenteringSpan } from "@dataware-tools/app-common";
import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import { useState } from "react";
import {
  DatabaseAddModal,
  DatabaseAddModalProps,
} from "components/organisms/DatabaseAddModal";

type Props = {
  isOpenDatabaseAddModal: boolean;
  onOpenDatabaseAddModal: () => void;
  onCloseDatabaseAddModal: () => void;
} & ContainerProps;

type ContainerProps = {
  onAddDatabaseSucceeded?: DatabaseAddModalProps["onSubmitSucceeded"];
};

const Component = ({
  onOpenDatabaseAddModal,
  isOpenDatabaseAddModal,
  onCloseDatabaseAddModal,
  onAddDatabaseSucceeded,
}: Props) => {
  return (
    <>
      <Button onClick={onOpenDatabaseAddModal} startIcon={<AddCircle />}>
        <TextCenteringSpan>Database</TextCenteringSpan>
      </Button>
      <DatabaseAddModal
        open={isOpenDatabaseAddModal}
        onClose={onCloseDatabaseAddModal}
        onSubmitSucceeded={onAddDatabaseSucceeded}
      />
    </>
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const [isOpenDatabaseAddModal, setIsOpenDatabaseAddModal] = useState(false);

  const onOpenDatabaseAddModal = () => setIsOpenDatabaseAddModal(true);
  const onCloseDatabaseAddModal = () => setIsOpenDatabaseAddModal(false);
  return (
    <Component
      {...delegated}
      isOpenDatabaseAddModal={isOpenDatabaseAddModal}
      onOpenDatabaseAddModal={onOpenDatabaseAddModal}
      onCloseDatabaseAddModal={onCloseDatabaseAddModal}
    />
  );
};

export { Container as DatabaseAddButton };
export type { ContainerProps as DatabaseAddButtonProps };
