import Dialog from "@material-ui/core/Dialog";
import { useState, useEffect } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import {
  DatabaseConfigType,
  useGetConfig,
  fetchMetaStore,
  pydtkSystemColumns,
  compInputFields,
} from "utils/index";
import {
  InputConfigList,
  InputConfigListProps,
} from "components/organisms/InputConfigList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ErrorMessage,
  metaStore,
  DialogCloseButton,
  DialogToolBar,
  DialogBody,
  DialogTitle,
  DialogContainer,
  SquareIconButton,
  TextCenteringSpan,
  DialogWrapper,
  DialogMain,
  usePrevious,
  // NoticeableLetters,
} from "@dataware-tools/app-common";
import {
  InputConfigAddModal,
  InputConfigAddModalProps,
} from "components/organisms/InputConfigAddModal";
import { produce } from "immer";
import { mutate } from "swr";

type ConfigNameType = "record_add_editable_columns";

type ContainerProps = {
  open: boolean;
  onClose: () => void;
  databaseId: string;
};

const Container = ({
  open,
  onClose,
  databaseId,
}: ContainerProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const [isSaving, setIsSaving] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [databaseColumns, setDatabaseColumns] = useState<
    InputConfigListProps["value"]
  >([]);
  const [databaseColumnOptions, setDatabaseColumnOptions] = useState<
    { name: string; display_name: string }[]
  >([]);

  const [getConfigRes, getConfigError, getConfigCacheKey] = (useGetConfig(
    getAccessToken,
    {
      databaseId,
    }
  ) as unknown) as [
    data: DatabaseConfigType | undefined,
    error: any,
    cacheKey: string
  ];

  useEffect(() => {
    setDatabaseColumns(
      getConfigRes?.columns.map((column) => ({
        name: column.name,
        display_name: column.display_name,
        necessity: column.necessity || "unnecessary",
      })) || []
    );

    setDatabaseColumnOptions(
      (getConfigRes?.columns
        .filter(
          (column) =>
            !column.name.startsWith("_") &&
            !pydtkSystemColumns.includes(column.name) &&
            (column.necessity == null || column.necessity === "unnecessary")
        )
        ?.map((column) => ({
          display_name: column.display_name,
          name: column.name,
        })) || []) as {
        name: string;
        display_name: string;
      }[]
    );
  }, [getConfigRes]);

  const initializeState = () => {
    setIsSaving(false);
  };
  // See: https://stackoverflow.com/questions/58209791/set-initial-state-for-material-ui-dialog
  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (open && !prevOpen) {
      initializeState();
    }
  }, [open, prevOpen]);

  const onSave = async () => {
    if (getConfigRes && databaseColumns) {
      setIsSaving(true);

      const newDatabaseConfig = produce(getConfigRes, (draft) => {
        // update existing columns
        draft.columns = getConfigRes.columns.map((oldColumn) => {
          const newColumn = databaseColumns.find(
            (column) => column.name === oldColumn.name
          );
          return { ...oldColumn, ...newColumn };
        });

        // add new columns
        const addedColumns = databaseColumns
          .filter((column) => {
            const existingNames = getConfigRes.columns.map(
              (column) => column.name
            );
            return !existingNames.includes(column.name);
          })
          .map((column) => ({
            name: column.name,
            display_name: column.display_name,
            necessity: column.necessity,
            dtype: "string" as const,
            aggregation: "first" as const,
          }));
        draft.columns = draft.columns.concat(addedColumns);
      });

      const [data, error] = await fetchMetaStore(
        getAccessToken,
        metaStore.ConfigService.updateConfig,
        {
          databaseId,
          requestBody: newDatabaseConfig,
        }
      );

      if (error) {
        // TODO: show error
      } else {
        mutate(getConfigCacheKey, data);
      }

      setIsSaving(false);
    }
    onClose();
  };

  const onAdd: InputConfigAddModalProps["onSave"] = (newColumn) => {
    setDatabaseColumns((prev) => {
      if (prev.some((prevColumn) => prevColumn.name === newColumn.name)) {
        return prev.map((prevColumn) =>
          prevColumn.name === newColumn.name
            ? { ...prevColumn, ...newColumn }
            : prevColumn
        );
      } else {
        return [...prev, newColumn];
      }
    });
    setDatabaseColumnOptions((prev) => {
      if (prev) {
        const newOptions = produce(prev, (prev) => {
          prev.splice(
            prev.findIndex((elem) => elem.name === newColumn.name),
            1
          );
        });
        return newOptions;
      } else {
        return prev;
      }
    });
  };

  const onChange: InputConfigListProps["onChange"] = (
    _,
    action,
    newValue,
    oldValue
  ) => {
    if (getConfigRes && databaseColumns) {
      if (action === "delete") {
        setDatabaseColumns((prev) =>
          prev.map((column) =>
            column.name === oldValue.name
              ? { ...column, necessity: "unnecessary" }
              : column
          )
        );
        setDatabaseColumnOptions((prev) => {
          if (prev) {
            const newOptions = produce(prev, (prev) => {
              prev.push({
                name: oldValue.name,
                display_name: oldValue.display_name,
              });
            });
            return newOptions;
          } else {
            return [
              { name: oldValue.name, display_name: oldValue.display_name },
            ];
          }
        });
      } else if (action === "change") {
        setDatabaseColumns((prev) =>
          prev.map((column) =>
            column.name === oldValue.name ? { ...column, ...newValue } : column
          )
        );
      }
    }
  };

  const inputConfig = databaseColumns
    ?.filter((column) => column.necessity && column.necessity !== "unnecessary")
    .sort(compInputFields);

  const alreadyUsedDisplayNames = [
    ...new Set(inputConfig.map((column) => column.display_name)),
  ];

  const alreadyUsedNames = [
    ...new Set(inputConfig.map((column) => column.name)),
  ];

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>
          {/* // TODO:Fix typeError */}
          {/* <NoticeableLetters> */}
          <TextCenteringSpan>Input columns</TextCenteringSpan>
          {/* </NoticeableLetters> */}
          {getConfigRes ? (
            <SquareIconButton
              onClick={() => setOpenAddModal(true)}
              icon={<AddCircleIcon />}
            />
          ) : null}
        </DialogTitle>
        <DialogContainer padding="0 0 20px">
          {getConfigError ? (
            <ErrorMessage
              reason={JSON.stringify(getConfigError)}
              instruction="please reload this page"
            />
          ) : inputConfig ? (
            <DialogBody>
              <DialogMain>
                <InputConfigList value={inputConfig} onChange={onChange} />
              </DialogMain>
              <DialogToolBar
                right={
                  <LoadingButton pending={isSaving} onClick={onSave}>
                    Save
                  </LoadingButton>
                }
              />
            </DialogBody>
          ) : null}
          {databaseColumnOptions ? (
            <InputConfigAddModal
              options={databaseColumnOptions}
              open={openAddModal}
              onClose={() => setOpenAddModal(false)}
              onSave={(newColumn) => onAdd(newColumn)}
              alreadyUsedNames={alreadyUsedNames}
              alreadyUsedDisplayNames={alreadyUsedDisplayNames}
            />
          ) : null}
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export { Container as InputConfigEditModal };
export type { ContainerProps as InputConfigEditModalProps, ConfigNameType };
