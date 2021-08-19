import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/app-common";
import { useState } from "react";
import { DatabaseDeleteModal } from "./DatabaseDeleteModal";
import { DatabaseEditModal } from "./DatabaseEditModal";
import {
  DatabaseMenuButton,
  DatabaseMenuButtonProps,
} from "components/molecules/DatabaseMenuButton";
import { DisplayConfigEditModal } from "components/organisms/DisplayConfigEditModal";
import { ExportMetadataModal } from "components/organisms/ExportMetadataModal";
import { InputConfigEditModal } from "components/organisms/InputConfigEditModal";
import { SearchConfigEditModal } from "components/organisms/SearchConfigEditModal";
import { SecretConfigEditModal } from "components/organisms/SecretConfigEditModal";
import { useIsActionPermitted } from "globalStates";
import { useGetDatabase } from "utils";

type Props = {
  menu: DatabaseMenuButtonProps["menu"];
  isOpenDisplayConfigModal: boolean;
  isOpenInputConfigEditModal: boolean;
  isOpenSearchConfigEditModal: boolean;
  isOpenSecretConfigEditModal: boolean;
  isOpenDatabaseEditModal: boolean;
  isOpenDatabaseDeleteModal: boolean;
  isOpenExportMetadataModal: boolean;
  onSelectMenu: DatabaseMenuButtonProps["onMenuSelect"];
  onCloseDisplayConfigModal: () => void;
  onCloseInputConfigEditModal: () => void;
  onCloseSearchConfigEditModal: () => void;
  onCloseSecretConfigEditModal: () => void;
  onCloseDatabaseEditModal: () => void;
  onCloseDatabaseDeleteModal: () => void;
  onCloseExportMetadataModal: () => void;
  databaseInfo?: metaStore.DatabaseModel;
} & ContainerProps;

type ContainerProps = {
  databaseId: string;
};

const Component = ({
  databaseId,
  onSelectMenu,
  menu,
  isOpenDisplayConfigModal,
  onCloseDisplayConfigModal,
  isOpenInputConfigEditModal,
  onCloseInputConfigEditModal,
  isOpenSearchConfigEditModal,
  onCloseSearchConfigEditModal,
  isOpenSecretConfigEditModal,
  onCloseSecretConfigEditModal,
  isOpenExportMetadataModal,
  onCloseExportMetadataModal,
  isOpenDatabaseEditModal,
  onCloseDatabaseEditModal,
  isOpenDatabaseDeleteModal,
  onCloseDatabaseDeleteModal,
  databaseInfo,
}: Props): JSX.Element => {
  return (
    <>
      <DatabaseMenuButton onMenuSelect={onSelectMenu} menu={menu} />
      <DisplayConfigEditModal
        databaseId={databaseId}
        open={isOpenDisplayConfigModal}
        onClose={onCloseDisplayConfigModal}
      />
      <InputConfigEditModal
        databaseId={databaseId}
        open={isOpenInputConfigEditModal}
        onClose={onCloseInputConfigEditModal}
      />
      <SearchConfigEditModal
        databaseId={databaseId}
        open={isOpenSearchConfigEditModal}
        onClose={onCloseSearchConfigEditModal}
      />
      <SecretConfigEditModal
        databaseId={databaseId}
        open={isOpenSecretConfigEditModal}
        onClose={onCloseSecretConfigEditModal}
      />
      <DatabaseEditModal
        databaseId={databaseId}
        open={isOpenDatabaseEditModal}
        onClose={onCloseDatabaseEditModal}
        currentData={databaseInfo}
      />
      {isOpenDatabaseDeleteModal ? (
        <DatabaseDeleteModal
          databaseId={databaseId}
          onClose={onCloseDatabaseDeleteModal}
        />
      ) : null}
      <ExportMetadataModal
        databaseId={databaseId}
        open={isOpenExportMetadataModal}
        onClose={onCloseExportMetadataModal}
      />
    </>
  );
};

const Container = ({
  databaseId,
  ...delegated
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const isPermittedConfigureDatabase = useIsActionPermitted(
    "databases:write:update"
  );
  const isPermittedDeleteDatabase = useIsActionPermitted(
    "databases:write:delete"
  );
  const [isOpenDisplayConfigModal, setIsOpenDisplayConfigModal] = useState(
    false
  );
  const [isOpenInputConfigModal, setIsOpenInputConfigModal] = useState(false);
  const [isOpenSearchConfigModal, setIsOpenSearchConfigModal] = useState(false);
  const [isOpenSecretConfigModal, setIsOpenSecretConfigModal] = useState(false);
  const [isOpenDatabaseEditModal, setIsOpenDatabaseEditModal] = useState(false);
  const [isOpenExportMetadataModal, setIsOpenExportMetadataModal] = useState(
    false
  );
  const [isOpenDatabaseDeleteModal, setIsOpenDatabaseDeleteModal] = useState(
    false
  );
  const { data: getDatabaseRes } = useGetDatabase(getAccessToken, {
    databaseId,
  });

  const menu: Props["menu"] = [
    isPermittedConfigureDatabase
      ? { value: "Configure display columns" }
      : undefined,
    isPermittedConfigureDatabase
      ? { value: "Configure input columns" }
      : undefined,
    isPermittedConfigureDatabase
      ? { value: "Configure search target columns" }
      : undefined,
    isPermittedConfigureDatabase
      ? { value: "Configure secret columns" }
      : undefined,
    isPermittedConfigureDatabase
      ? { value: "Update database info" }
      : undefined,
    { value: "Export metadata" },
    isPermittedDeleteDatabase
      ? { value: "Delete database", boxProps: { color: "error.main" } }
      : undefined,
  ];

  const onSelectMenu: Props["onSelectMenu"] = (targetName) => {
    switch (targetName) {
      case menu[0]?.value:
        setIsOpenDisplayConfigModal(true);
        break;
      case menu[1]?.value:
        setIsOpenInputConfigModal(true);
        break;
      case menu[2]?.value:
        setIsOpenSearchConfigModal(true);
        break;
      case menu[3]?.value:
        setIsOpenSecretConfigModal(true);
        break;
      case menu[4]?.value:
        setIsOpenDatabaseEditModal(true);
        break;
      case menu[5]?.value:
        setIsOpenExportMetadataModal(true);
        break;
      case menu[6]?.value:
        setIsOpenDatabaseDeleteModal(true);
        break;
    }
  };

  return (
    <Component
      {...delegated}
      databaseInfo={getDatabaseRes}
      databaseId={databaseId}
      isOpenDisplayConfigModal={isOpenDisplayConfigModal}
      isOpenInputConfigEditModal={isOpenInputConfigModal}
      isOpenSearchConfigEditModal={isOpenSearchConfigModal}
      isOpenSecretConfigEditModal={isOpenSecretConfigModal}
      isOpenExportMetadataModal={isOpenExportMetadataModal}
      isOpenDatabaseEditModal={isOpenDatabaseEditModal}
      isOpenDatabaseDeleteModal={isOpenDatabaseDeleteModal}
      menu={menu}
      onSelectMenu={onSelectMenu}
      onCloseDisplayConfigModal={() => setIsOpenDisplayConfigModal(false)}
      onCloseInputConfigEditModal={() => setIsOpenInputConfigModal(false)}
      onCloseSearchConfigEditModal={() => setIsOpenSearchConfigModal(false)}
      onCloseSecretConfigEditModal={() => setIsOpenSecretConfigModal(false)}
      onCloseDatabaseEditModal={() => setIsOpenDatabaseEditModal(false)}
      onCloseExportMetadataModal={() => setIsOpenExportMetadataModal(false)}
      onCloseDatabaseDeleteModal={() => setIsOpenDatabaseDeleteModal(false)}
    />
  );
};

export { Container as ControlledDatabaseMenuButton };
export type { ContainerProps as ControlledDatabaseMenuButtonProps };
