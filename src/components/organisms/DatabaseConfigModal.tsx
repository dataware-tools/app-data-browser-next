import { InputConfigEditModal } from "components/organisms/InputConfigEditModal";
import { DisplayConfigEditModal } from "./DisplayConfigEditModal";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  configName: DatabaseConfigNameType;
};

type DatabaseConfigNameType = "recordInputConfig" | "recordDisplayConfig";

const Container = ({
  configName,
  ...delegated
}: ContainerProps): JSX.Element => {
  switch (configName) {
    case "recordInputConfig":
      return <InputConfigEditModal {...delegated} configName={configName} />;
    case "recordDisplayConfig":
      return <DisplayConfigEditModal {...delegated} configName={configName} />;
  }
};

export { Container as DatabaseConfigModal };
export type {
  ContainerProps as DatabaseConfigModalProps,
  DatabaseConfigNameType,
};
