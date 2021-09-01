import {
  DisplayConfigEditModal,
  ConfigNameType as DisplayConfigNameType,
} from "components/organisms/DisplayConfigEditModal";
import {
  ExportMetadataModal,
  ConfigNameType as ExportMetadataNameType,
} from "components/organisms/ExportMetadataModal";
import {
  InputConfigEditModal,
  ConfigNameType as InputConfigNameType,
} from "components/organisms/InputConfigEditModal";
import {
  SearchConfigEditModal,
  ConfigNameType as SearchConfigNameType,
} from "components/organisms/SearchConfigEditModal";
import {
  SecretConfigEditModal,
  ConfigNameType as SecretConfigNameType,
} from "components/organisms/SecretConfigEditModal";

export type DatabaseConfigModalProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
  configName: DatabaseConfigNameType;
};

export type DatabaseConfigNameType =
  | InputConfigNameType
  | DisplayConfigNameType
  | SearchConfigNameType
  | ExportMetadataNameType
  | SecretConfigNameType;

export const DatabaseConfigModal = ({
  configName,
  ...delegated
}: DatabaseConfigModalProps): JSX.Element => {
  switch (configName) {
    case "record_add_editable_columns":
      return <InputConfigEditModal {...delegated} />;
    case "record_list_display_columns":
      return <DisplayConfigEditModal {...delegated} />;
    case "record_search_target_columns":
      return <SearchConfigEditModal {...delegated} />;
    case "secret_columns":
      return <SecretConfigEditModal {...delegated} />;
    case "export_metadata":
      return <ExportMetadataModal {...delegated} />;
  }
};
