import {
  ErrorMessage,
  jobStore,
  ErrorMessageProps,
} from "@dataware-tools/app-common";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import Popover from "@material-ui/core/Popover";
import { MouseEvent, useState } from "react";

type JobViewerDOMProps = {
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

const JobViewerDOM = ({
  error,
  anchorEl,
  onOpenPopover,
  onClosePopover,
  onClickExecuteButton,
  scripts,
  currentShownScript,
}: JobViewerDOMProps): JSX.Element => {
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

  const onOpenPopover: JobViewerDOMProps["onOpenPopover"] = (event, script) => {
    setAnchorEl(event.currentTarget);
    setCurrentShownScript(script);
  };

  const onClosePopover = () => {
    setAnchorEl(undefined);
    setCurrentShownScript(undefined);
  };

  const onClickExecuteButton: JobViewerDOMProps["onClickExecuteButton"] = (
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
      ? // @ts-expect-error Fix API
        job.output.reason
        ? // @ts-expect-error Fix API
          { reason: job.output.reason }
        : { reason: "unknown Error" }
      : undefined;

  return (
    <JobViewerDOM
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
