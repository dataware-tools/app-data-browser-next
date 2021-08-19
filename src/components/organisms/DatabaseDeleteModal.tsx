import { useAuth0 } from "@auth0/auth0-react";
import {
  ConfirmModal,
  ConfirmModalProps,
  metaStore,
  ErrorMessageProps,
  ErrorMessage,
  Spacer,
  extractErrorMessageFromFetchError,
} from "@dataware-tools/app-common";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
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

export const DatabaseDeleteModalPresentation = (
  props: DatabaseDeleteModalPresentationProps
): JSX.Element => {
  const {
    error,
    databaseId,
    onClose,
    formControl,
    validateRules,
    validateErrors,
    validateErrorMessages,
    ...dialogProps
  } = props;

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

export const DatabaseDeleteModal = (
  props: DatabaseDeleteModalProps
): JSX.Element => {
  const { databaseId } = props;
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
      props.onClose();
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

    console.log(cancelCloseModal);
    if (!cancelCloseModal) {
      props.onClose();
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
