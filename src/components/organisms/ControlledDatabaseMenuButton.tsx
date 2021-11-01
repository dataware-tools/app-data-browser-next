import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import { useState } from "react";
import { DatabaseConfigModal } from "./DatabaseConfigModal";
import { DatabaseDeleteModal } from "./DatabaseDeleteModal";
import { DatabaseEditModal } from "./DatabaseEditModal";
import {
  DatabaseMenuButton,
  DatabaseMenuButtonProps,
} from "components/molecules/DatabaseMenuButton";
import { ExportMetadataModal } from "components/organisms/ExportMetadataModal";
import { useIsActionPermitted } from "globalStates";
import { useGetDatabase } from "utils";

export type ControlledDatabaseMenuButtonPresentationProps = {
  menu: DatabaseMenuButtonProps["menu"];
  isOpenDatabaseConfigModal: boolean;
  isOpenDatabaseEditModal: boolean;
  isOpenDatabaseDeleteModal: boolean;
  isOpenExportMetadataModal: boolean;
  onSelectMenu: DatabaseMenuButtonProps["onMenuSelect"];
  onCloseDatabaseConfigModal: () => void;
  onCloseDatabaseEditModal: () => void;
  onCloseDatabaseDeleteModal: () => void;
  onCloseExportMetadataModal: () => void;
  databaseInfo?: metaStore.DatabaseModel;
} & ControlledDatabaseMenuButtonProps;

export type ControlledDatabaseMenuButtonProps = {
  databaseId: string;
};

export const ControlledDatabaseMenuButtonPresentation = ({
  databaseId,
  onSelectMenu,
  menu,
  isOpenDatabaseConfigModal,
  onCloseDatabaseConfigModal,
  isOpenExportMetadataModal,
  onCloseExportMetadataModal,
  isOpenDatabaseEditModal,
  onCloseDatabaseEditModal,
  isOpenDatabaseDeleteModal,
  onCloseDatabaseDeleteModal,
  databaseInfo,
}: ControlledDatabaseMenuButtonPresentationProps): JSX.Element => {
  return (
    <>
      <DatabaseMenuButton onMenuSelect={onSelectMenu} menu={menu} />
      <DatabaseConfigModal
        databaseId={databaseId}
        open={isOpenDatabaseConfigModal}
        onClose={onCloseDatabaseConfigModal}
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

export const ControlledDatabaseMenuButton = ({
  databaseId,
  ...delegated
}: ControlledDatabaseMenuButtonProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const isPermittedConfigureDatabase = useIsActionPermitted(
    "databases:write:update"
  );
  const isPermittedDeleteDatabase = useIsActionPermitted(
    "databases:write:delete"
  );
  const [isOpenDatabaseConfigModal, setIsOpenDatabaseConfigModal] = useState(
    false
  );
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

  const menu: ControlledDatabaseMenuButtonPresentationProps["menu"] = [
    isPermittedConfigureDatabase ? { value: "Configure database" } : undefined,
    isPermittedConfigureDatabase
      ? { value: "Update database info" }
      : undefined,
    { value: "Export metadata" },
    isPermittedDeleteDatabase
      ? { value: "Delete database", boxProps: { color: "error.main" } }
      : undefined,
  ];

  const onSelectMenu: ControlledDatabaseMenuButtonPresentationProps["onSelectMenu"] = (
    targetName
  ) => {
    switch (targetName) {
      case menu[0]?.value:
        setIsOpenDatabaseConfigModal(true);
        break;
      case menu[1]?.value:
        setIsOpenDatabaseEditModal(true);
        break;
      case menu[2]?.value:
        setIsOpenExportMetadataModal(true);
        break;
      case menu[3]?.value:
        setIsOpenDatabaseDeleteModal(true);
        break;
    }
  };

  return (
    <ControlledDatabaseMenuButtonPresentation
      {...delegated}
      databaseInfo={getDatabaseRes}
      databaseId={databaseId}
      isOpenDatabaseConfigModal={isOpenDatabaseConfigModal}
      isOpenExportMetadataModal={isOpenExportMetadataModal}
      isOpenDatabaseEditModal={isOpenDatabaseEditModal}
      isOpenDatabaseDeleteModal={isOpenDatabaseDeleteModal}
      menu={menu}
      onSelectMenu={onSelectMenu}
      onCloseDatabaseConfigModal={() => setIsOpenDatabaseConfigModal(false)}
      onCloseDatabaseEditModal={() => setIsOpenDatabaseEditModal(false)}
      onCloseExportMetadataModal={() => setIsOpenExportMetadataModal(false)}
      onCloseDatabaseDeleteModal={() => setIsOpenDatabaseDeleteModal(false)}
    />
  );
};
