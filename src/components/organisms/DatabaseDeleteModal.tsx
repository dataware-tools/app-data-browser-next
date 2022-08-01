import { useAuth0 } from "@auth0/auth0-react";
import { metaStore } from "@dataware-tools/api-meta-store-client";
import {
  ConfirmModal,
  ConfirmModalProps,
  Spacer,
} from "@dataware-tools/app-common";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  useForm,
  Controller,
  ControllerProps,
  Control,
  FieldErrors,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ElemCenteringFlexDiv } from "components/atoms/ElemCenteringFlexDiv";
import { databasePaginateState } from "globalStates";
import {
  enqueueErrorToastForFetchError,
  useListDatabases,
  fetchMetaStore,
  APP_ROUTE,
} from "utils";

type ConfirmInputType = { databaseId: string };
type ValidateRuleType = ControllerProps["rules"];

export type DatabaseDeleteModalPresentationProps = {
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
  const navigate = useNavigate();
  const { page, perPage, search } = useRecoilValue(databasePaginateState);
  const {
    control,
    handleSubmit,
    formState: { errors: validateErrors },
  } = useForm<ConfirmInputType>();
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
  const validateErrorMessages: DatabaseDeleteModalPresentationProps["validateErrorMessages"] =
    {
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
          enqueueErrorToastForFetchError(
            "Failed to delete database",
            deleteDatabaseError
          );
          cancelCloseModal = true;
        } else if (deleteDatabaseRes) {
          listDatabaseMutate();
          navigate(APP_ROUTE.DATABASE_LIST);
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
      validateErrors={validateErrors}
      validateErrorMessages={validateErrorMessages}
      validateRules={validateRules}
      formControl={control}
      databaseId={databaseId}
      onClose={onClose}
    />
  );
};
