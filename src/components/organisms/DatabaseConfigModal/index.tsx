import {
  DialogWrapper,
  DialogContainer,
  DialogCloseButton,
  usePrevious,
  DialogTabBar,
  DialogTitle,
  NoticeableLetters,
} from "@dataware-tools/app-common";
import Dialog from "@mui/material/Dialog";
import { useState, useEffect, ReactNode } from "react";
import { DisplayFieldsConfigBody } from "./DisplayFieldsConfigBody";
import { InputFieldsConfigBody } from "./InputFieldsConfigBody";
import { SearchFieldsConfigBody } from "./SearchFieldsConfigBody";
import { SecretFieldsConfigBody } from "./SecretFieldsConfigBody";

export type ConfigNameType = "record_list_display_columns";

export type DatabaseConfigModalPresentationProps = {
  tabIndex: number;
  tabNames: string[];
  onTabChange: (tabIndex: number) => void;
  bodyComponent: ReactNode;
} & DatabaseConfigModalProps;

export type DatabaseConfigModalProps = {
  open: boolean;
  databaseId: string;
  onClose: () => void;
};

export const DatabaseConfigModalPresentation = ({
  open,
  tabIndex,
  tabNames,
  onTabChange,
  bodyComponent,
  onClose,
}: DatabaseConfigModalPresentationProps): JSX.Element => {
  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          <NoticeableLetters>Configure database</NoticeableLetters>
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          <DialogTabBar
            value={tabIndex}
            tabNames={tabNames}
            onChange={onTabChange}
          />
          {bodyComponent}
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export const DatabaseConfigModal = ({
  open,
  onClose,
  databaseId,
}: DatabaseConfigModalProps): JSX.Element => {
  const [tabIndex, setTabIndex] = useState(0);

  const initializeState = () => {
    setTabIndex(0);
  };
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const tabNames = [
    "Input fields",
    "Display fields",
    "Search fields",
    "Secret fields",
  ];

  const bodyComponent =
    tabIndex === 0 ? (
      <InputFieldsConfigBody databaseId={databaseId} />
    ) : tabIndex === 1 ? (
      <DisplayFieldsConfigBody databaseId={databaseId} />
    ) : tabIndex === 2 ? (
      <SearchFieldsConfigBody databaseId={databaseId} />
    ) : tabIndex === 3 ? (
      <SecretFieldsConfigBody databaseId={databaseId} />
    ) : null;

  return (
    <DatabaseConfigModalPresentation
      databaseId={databaseId}
      bodyComponent={bodyComponent}
      onClose={onClose}
      open={open}
      onTabChange={setTabIndex}
      tabIndex={tabIndex}
      tabNames={tabNames}
    />
  );
};
