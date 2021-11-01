import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  ConfirmModal,
  ConfirmModalProps,
  ErrorMessageProps,
  ErrorMessage,
  Spacer,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import {
  useForm,
  Controller,
  ControllerProps,
  Control,
  FieldErrors,
} from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { databasePaginateState } from "globalStates";
import { useListDatabases, fetchMetaStore, APP_ROUTE } from "utils";

type ConfirmInputType = { databaseId: string };
type ValidateRuleType = ControllerProps["rules"];

export type DatabaseDeleteModalPresentationProps = {
  error?: ErrorMessageProps;
  formControl: Control<ConfirmInputType>;
  validateRules: Record<keyof ConfirmInputType, ValidateRuleType>;
  validateErrors: FieldErrors<ConfirmInputType>;
  validateErrorMessages: Record<
    keyof ConfirmInputType,
    Record<keyof ValidateRuleType, string>
  >;
} & Pick<DatabaseDeleteModalProps, "databaseId"> &
  ConfirmModalProps;

export type DatabaseDeleteModalProps = {
  databaseId: string;
  onClose: () => void;
};

export const DatabaseDeleteModalPresentation = ({
  error,
  databaseId,
  onClose,
  formControl,
  validateRules,
  validateErrors,
  validateErrorMessages,
  ...dialogProps
}: DatabaseDeleteModalPresentationProps): JSX.Element => {
  return (
    <ConfirmModal
      onClose={onClose}
      title={`Are you sure you want to delete ${databaseId}?`}
      confirmMode="delete"
      body={
        error ? (
          <ErrorMessage {...error} />
        ) : (
          <ElemCenteringFlexDiv>
            <Box component="span" sx={{ color: "error.main" }}>
              Type "{databaseId}" to confirm:
            </Box>
            <Spacer direction="horizontal" size="1rem" />
            <Controller
              name="databaseId"
              control={formControl}
              rules={validateRules.databaseId}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    error={Boolean(validateErrors.databaseId)}
                    helperText={
                      validateErrors.databaseId
                        ? validateErrorMessages.databaseId[
                            validateErrors.databaseId.type
                          ]
                        : undefined
                    }
                  />
                );
              }}
            />
          </ElemCenteringFlexDiv>
        )
      }
      {...dialogProps}
    />
  );
};

export const DatabaseDeleteModal = ({
  databaseId,
  onClose: propsOnClose,
}: DatabaseDeleteModalProps): JSX.Element => {
  const { getAccessTokenSilently: getAccessToken } = useAuth0();
  const history = useHistory();
  const { page, perPage, search } = useRecoilValue(databasePaginateState);
  const {
    control,
    handleSubmit,
    formState: { errors: validateErrors },
  } = useForm<ConfirmInputType>();
  const [error, setError] = useState<
    DatabaseDeleteModalPresentationProps["error"] | undefined
  >(undefined);

  const { mutate: listDatabaseMutate } = useListDatabases(getAccessToken, {
    page,
    perPage,
    search,
  });

  const validateRules: DatabaseDeleteModalPresentationProps["validateRules"] = {
    databaseId: {
      required: true,
      validate: {
        mismatch: (input: string) => databaseId === input,
      },
    },
  };
  const validateErrorMessages: DatabaseDeleteModalPresentationProps["validateErrorMessages"] = {
    databaseId: {
      required: "Database id must be inputted",
      mismatch: "Database id is incorrect",
    },
  };
  const onClose: DatabaseDeleteModalPresentationProps["onClose"] = async (
    isConfirmed
  ) => {
    if (!isConfirmed) {
      propsOnClose();
      return {};
    }

    let cancelCloseModal = false;
    await handleSubmit(
      async (data) => {
        const [deleteDatabaseRes, deleteDatabaseError] = await fetchMetaStore(
          getAccessToken,
          metaStore.DatabaseService.deleteDatabase,
          {
            databaseId: data.databaseId,
          }
        );

        if (deleteDatabaseError) {
          const { reason, instruction } = extractErrorMessageFromFetchError(
            deleteDatabaseError
          );
          setError({
            reason,
            instruction,
          });
          cancelCloseModal = true;
        } else if (deleteDatabaseRes) {
          listDatabaseMutate();
          history.push(APP_ROUTE.DATABASE_LIST);
        }
      },
      () => {
        cancelCloseModal = true;
      }
    )();

    if (!cancelCloseModal) {
      propsOnClose();
    }
    return { cancelCloseModal };
  };

  return (
    <DatabaseDeleteModalPresentation
      error={error}
      validateErrors={validateErrors}
      validateErrorMessages={validateErrorMessages}
      validateRules={validateRules}
      formControl={control}
      databaseId={databaseId}
      onClose={onClose}
    />
  );
};
