import {
  InputConfigEditModal,
  InputConfigEditModalProps,
} from "components/organisms/InputConfigEditModal";
import {
  DisplayConfigEditModal,
  DisplayConfigEditModalProps,
} from "./DisplayConfigEditModal";

type ContainerProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
  configName: DatabaseConfigNameType;
};

type DatabaseConfigNameType =
  | InputConfigEditModalProps["configName"]
  | DisplayConfigEditModalProps["configName"];

const Container = ({
  configName,
  ...delegated
}: ContainerProps): JSX.Element => {
  switch (configName) {
    case "record_input_config":
      return <InputConfigEditModal {...delegated} configName={configName} />;
    case "record_display_config":
      return <DisplayConfigEditModal {...delegated} configName={configName} />;
  }
};

export { Container as DatabaseConfigModal };
export type {
  ContainerProps as DatabaseConfigModalProps,
  DatabaseConfigNameType,
};
