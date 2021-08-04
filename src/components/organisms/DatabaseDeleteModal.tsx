import {
  ConfirmModal,
  ConfirmModalProps,
  metaStore,
  ErrorMessageProps,
  ErrorMessage,
  theme as themeInstance,
  Spacer,
} from "@dataware-tools/app-common";
import {
  useForm,
  Controller,
  ControllerProps,
  Control,
  FieldErrors,
} from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import {
  useListDatabases,
  fetchMetaStore,
  extractReasonFromFetchError,
  APP_ROUTE,
} from "utils";
import { useRecoilValue } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { databasePaginateState } from "globalStates";
import { useState } from "react";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { makeStyles } from "@material-ui/core/styles";

type ConfirmInputType = { databaseId: string };
type ValidateRuleType = ControllerProps["rules"];

export type DatabaseDeleteModalDOMProps = {
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

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  caution: {
    color: theme.palette.error.main,
  },
}));

export const DatabaseDeleteModalDOM = (
  props: DatabaseDeleteModalDOMProps
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
  const classes = useStyles();

  return (
    <ConfirmModal
      onClose={onClose}
      title={`Are you sure you want to delete ${databaseId}?`}
      body={
        error ? (
          <ErrorMessage {...error} />
        ) : (
          <ElemCenteringFlexDiv>
            <span className={classes.caution}>
              Type "{databaseId}" to confirm:
            </span>
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
    DatabaseDeleteModalDOMProps["error"] | undefined
  >(undefined);

  const { mutate: listDatabaseMutate } = useListDatabases(getAccessToken, {
    page,
    perPage,
    search,
  });

  const validateRules: DatabaseDeleteModalDOMProps["validateRules"] = {
    databaseId: {
      required: true,
      validate: {
        mismatch: (input: string) => databaseId === input,
      },
    },
  };
  const validateErrorMessages: DatabaseDeleteModalDOMProps["validateErrorMessages"] = {
    databaseId: {
      required: "Database id must be inputted",
      mismatch: "Database id is incorrect",
    },
  };
  const onClose: DatabaseDeleteModalDOMProps["onClose"] = async (
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
          setError({
            reason: extractReasonFromFetchError(deleteDatabaseError),
            instruction: "Please reload this page",
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
    <DatabaseDeleteModalDOM
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
