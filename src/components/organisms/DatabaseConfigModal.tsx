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
    case "record_input_config":
      return <InputConfigEditModal {...delegated} configName={configName} />;
    case "record_display_config":
      return <DisplayConfigEditModal {...delegated} configName={configName} />;
    case "record_search_config":
      return <SearchConfigEditModal {...delegated} configName={configName} />;
    case "secret_columns":
      return <SecretConfigEditModal {...delegated} configName={configName} />;
    case "export_metadata":
      return <ExportMetadataModal {...delegated} />;
  }
};

export { Container as DatabaseConfigModal };
export type {
  ContainerProps as DatabaseConfigModalProps,
  DatabaseConfigNameType,
};
