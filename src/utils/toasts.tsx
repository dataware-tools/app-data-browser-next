import {
  extractErrorMessageFromFetchError,
  ErrorMessage,
  ToastHavingDetailInfo,
} from "@dataware-tools/app-common";
import { toast } from "react-toastify";

export const enqueueErrorToastForFetchError = (message: string, error: any) => {
  const { reason, instruction } = extractErrorMessageFromFetchError(error);
  toast.error(
    <ToastHavingDetailInfo
      detailContent={
        <ErrorMessage
          variant="transparent"
          reason={reason}
          instruction={instruction}
        />
      }
    >
      {message}
    </ToastHavingDetailInfo>
  );
};
