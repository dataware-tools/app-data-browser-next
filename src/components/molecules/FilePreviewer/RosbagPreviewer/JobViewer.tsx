import {
  ErrorMessage,
  jobStore,
  ErrorMessageProps,
} from "@dataware-tools/app-common";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { MouseEvent, useState } from "react";

type JobViewerPresentationProps = {
  error?: ErrorMessageProps;
  anchorEl?: HTMLElement;
  onOpenPopover: (event: MouseEvent<HTMLElement>, script: string) => void;
  onClosePopover: () => void;
  onClickExecuteButton: (script: string) => void;
  scripts: string[];
  currentShownScript?: string;
};

type JobViewerProps = {
  jobType: jobStore.JobTypeModel;
  job: jobStore.JobPostedModel;
};

const JobViewerPresentation = ({
  error,
  anchorEl,
  onOpenPopover,
  onClosePopover,
  onClickExecuteButton,
  scripts,
  currentShownScript,
}: JobViewerPresentationProps): JSX.Element => {
  return (
    <>
      {error ? (
        <ErrorMessage {...error} />
      ) : (
        <Alert severity="success">
          <AlertTitle>Successfully submitted the job</AlertTitle>
          {scripts.map((script, index) => {
            return (
              <Button
                key={index}
                onClick={() => onClickExecuteButton(script)}
                onMouseEnter={(event) => onOpenPopover(event, script)}
                onMouseLeave={() => onClosePopover()}
              >
                Execute
              </Button>
            );
          })}
          <Popover
            // See https://github.com/mui-org/material-ui/issues/7212
            style={{ pointerEvents: "none" }}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={onClosePopover}
          >
            <div>{currentShownScript}</div>
          </Popover>
        </Alert>
      )}
    </>
  );
};

export const JobViewer = ({ job, jobType }: JobViewerProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);
  const [currentShownScript, setCurrentShownScript] = useState<
    string | undefined
  >(undefined);

  const onOpenPopover: JobViewerPresentationProps["onOpenPopover"] = (
    event,
    script
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentShownScript(script);
  };

  const onClosePopover = () => {
    setAnchorEl(undefined);
    setCurrentShownScript(undefined);
  };

  const onClickExecuteButton: JobViewerPresentationProps["onClickExecuteButton"] = (
    script
  ) => {
    // eslint-disable-next-line no-eval
    eval(script);
  };

  const scripts = Object.entries(jobType.job_type.scheme.output)
    // @ts-expect-error I don't know how to resolve this error
    .filter(([, value]) => value.isExecutable)
    .map(([key]) => job.output[key]);
  const error =
    job.output.code !== 200
      ? job.output.reason
        ? { reason: job.output.reason }
        : { reason: "unknown Error" }
      : undefined;

  return (
    <JobViewerPresentation
      anchorEl={anchorEl}
      scripts={scripts}
      error={error}
      currentShownScript={currentShownScript}
      onOpenPopover={onOpenPopover}
      onClosePopover={onClosePopover}
      onClickExecuteButton={onClickExecuteButton}
    />
  );
};
