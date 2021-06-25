import {
  InputConfigEditModal,
  ConfigNameType as InputConfigNameType,
} from "components/organisms/InputConfigEditModal";
import {
  DisplayConfigEditModal,
  ConfigNameType as DisplayConfigNameType,
} from "./DisplayConfigEditModal";
import {
  SearchConfigEditModal,
  ConfigNameType as SearchConfigNameType,
} from "./SearchConfigEditModal";
import {
  SecretConfigEditModal,
  ConfigNameType as SecretConfigNameType,
} from "./SecretConfigEditModal";
import {
  ExportMetadataModal,
  ConfigNameType as ExportMetadataNameType,
} from "./ExportMetadataModal";

type ContainerProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
  configName: DatabaseConfigNameType;
};

type DatabaseConfigNameType =
  | InputConfigNameType
  | DisplayConfigNameType
  | SearchConfigNameType
  | ExportMetadataNameType
  | SecretConfigNameType;

const Container = ({
  configName,
  ...delegated
}: ContainerProps): JSX.Element => {
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

export { Container as DatabaseConfigModal };
export type {
  ContainerProps as DatabaseConfigModalProps,
  DatabaseConfigNameType,
};
