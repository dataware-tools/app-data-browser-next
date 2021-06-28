import Dialog from "@material-ui/core/Dialog";
import { useState } from "react";
import {
  Spacer,
  DialogBody,
  DialogContainer,
  DialogToolBar,
  DialogTitle,
  DialogCloseButton,
  DialogWrapper,
  DialogMain,
  NoticeableLetters,
  TabBar,
} from "@dataware-tools/app-common";

type ComponentProps = ContainerProps;

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  databaseId: string;
  configName: ConfigNameType;
};

type ConfigNameType = "setting";

const Component = ({
  open,
  onClose,
  databaseId,
  configName,
}: ComponentProps): JSX.Element => {
  const [tabNameIndex, setTabNameIndex] = useState(0);
  const tabNames = [
    "Input Column",
    "Dispaly Columns",
    "Search Columns",
    "Secret Columns",
  ];

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <NoticeableLetters>Settings</NoticeableLetters>
        </DialogTitle>
        <DialogContainer height="auto">
          <TabBar
            tabNames={tabNames}
            onChange={setTabNameIndex}
            value={tabNameIndex}
          />
          <DialogBody>
            <DialogMain>
              <div>
                databaseId: {databaseId}, configName: {configName}
              </div>
            </DialogMain>
            <Spacer direction="vertical" size="2vh" />
          </DialogBody>
        </DialogContainer>
        <DialogToolBar />
      </DialogWrapper>
    </Dialog>
  );
};

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  return <Component {...delegated} />;
};

export { Container as DatabaseSetting };
export type { ContainerProps as DatabaseSettingProps, ConfigNameType };
