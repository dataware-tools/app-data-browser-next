import { ChangeEventHandler, useRef } from "react";
import LoadingButton, {
  LoadingButtonProps,
} from "@material-ui/lab/LoadingButton";

type ComponentProps = {
  onFileChange: (files: HTMLInputElement["files"]) => void | Promise<void>;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
} & LoadingButtonProps;

const Component = ({
  onFileChange,
  onClick,
  children,
  inputProps,
  ...delegated
}: ComponentProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileUpload: LoadingButtonProps["onClick"] = (event) => {
    if (onClick) {
      onClick(event);
    }
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const _onChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (inputRef.current) {
      await onFileChange(inputRef.current.files);
      // See: https://zenn.dev/dove/articles/1927889e1c4153#onchange%E3%81%AF%E9%80%A3%E7%B6%9A%E3%81%A7%E5%90%8C%E3%81%98%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%99%E3%82%8B%E3%81%A8%E7%99%BA%E7%81%AB%E3%81%97%E3%81%AA%E3%81%84
      event.target.value = "";
    }
  };

  return (
    <div>
      <LoadingButton {...delegated} onClick={onFileUpload}>
        {children}
      </LoadingButton>
      <input
        {...inputProps}
        hidden
        ref={inputRef}
        type="file"
        onChange={_onChange}
      />
    </div>
  );
};

export { Component as FileUploadButton };
export type { ComponentProps as FileUploadButtonProps };
