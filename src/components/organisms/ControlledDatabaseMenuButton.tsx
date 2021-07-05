import {
  DatabaseMenuButton,
  DatabaseMenuButtonProps,
} from "components/molecules/DatabaseMenuButton";
import { DisplayConfigEditModal } from "components/organisms/DisplayConfigEditModal";
import { ExportMetadataModal } from "components/organisms/ExportMetadataModal";
import { InputConfigEditModal } from "components/organisms/InputConfigEditModal";
import { SearchConfigEditModal } from "components/organisms/SearchConfigEditModal";
import { SecretConfigEditModal } from "components/organisms/SecretConfigEditModal";
import { useState } from "react";
import { useIsActionPermitted } from "globalStates";

type Props = {
  menu: DatabaseMenuButtonProps["menu"];
  isOpenDisplayConfigModal: boolean;
  isOpenInputConfigEditModal: boolean;
  isOpenSearchConfigEditModal: boolean;
  isOpenSecretConfigEditModal: boolean;
  isOpenExportMetadataModal: boolean;
  onSelectMenu: DatabaseMenuButtonProps["onMenuSelect"];
  onCloseDisplayConfigModal: () => void;
  onCloseInputConfigEditModal: () => void;
  onCloseSearchConfigEditModal: () => void;
  onCloseSecretConfigEditModal: () => void;
  onCloseExportMetadataModal: () => void;
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
      <ExportMetadataModal
        databaseId={databaseId}
        open={isOpenExportMetadataModal}
        onClose={onCloseExportMetadataModal}
      />
    </>
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const isPermittedConfigureDatabase = useIsActionPermitted(
    "databases:write:update"
  );
  const [isOpenDisplayConfigModal, setIsOpenDisplayConfigModal] = useState(
    false
  );
  const [isOpenInputConfigModal, setIsOpenInputConfigModal] = useState(false);
  const [isOpenSearchConfigModal, setIsOpenSearchConfigModal] = useState(false);
  const [isOpenSecretConfigModal, setIsOpenSecretConfigModal] = useState(false);
  const [isOpenExportMetadataModal, setIsOpenExportMetadataModal] = useState(
    false
  );

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
    { value: "Export metadata" },
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
        setIsOpenExportMetadataModal(true);
        break;
    }
  };

  return (
    <Component
      {...delegated}
      isOpenDisplayConfigModal={isOpenDisplayConfigModal}
      isOpenInputConfigEditModal={isOpenInputConfigModal}
      isOpenSearchConfigEditModal={isOpenSearchConfigModal}
      isOpenSecretConfigEditModal={isOpenSecretConfigModal}
      isOpenExportMetadataModal={isOpenExportMetadataModal}
      menu={menu}
      onSelectMenu={onSelectMenu}
      onCloseDisplayConfigModal={() => setIsOpenDisplayConfigModal(false)}
      onCloseInputConfigEditModal={() => setIsOpenInputConfigModal(false)}
      onCloseSearchConfigEditModal={() => setIsOpenSearchConfigModal(false)}
      onCloseSecretConfigEditModal={() => setIsOpenSecretConfigModal(false)}
      onCloseExportMetadataModal={() => setIsOpenExportMetadataModal(false)}
    />
  );
};

export { Container as ControlledDatabaseMenuButton };
export type { ContainerProps as ControlledDatabaseMenuButtonProps };
