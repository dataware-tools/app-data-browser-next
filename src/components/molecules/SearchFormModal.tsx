import {
  theme as themeInstance,
  DialogCloseButton,
  DialogContainer,
  DialogBody,
  DialogWrapper,
  DialogMain,
  SearchForm,
  SearchFormProps,
} from "@dataware-tools/app-common";
import { makeStyles } from "@material-ui/core/styles";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";

export type SearchFormModalDOMProps = {
  onSearch: SearchFormProps["onSearch"];
} & Omit<SearchFormModalProps, "onSearch">;

export type SearchFormModalProps = {
  onClose: () => void;
  onSearch: (searchText: string) => void;
  defaultSearchText: SearchFormProps["defaultValue"];
} & Omit<DialogProps, "onClose">;

export const useStyles = makeStyles((theme: typeof themeInstance) => ({
  sample: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export const SearchFormModalDOM = (
  props: SearchFormModalDOMProps
): JSX.Element => {
  const { onClose, onSearch, defaultSearchText, ...dialogProps } = props;
  return (
    <Dialog {...dialogProps} onClose={onClose} maxWidth="xl">
      <DialogWrapper>
        <DialogCloseButton onClick={onClose} />
        <DialogContainer>
          <DialogBody>
            <DialogMain width="80vw">
              <SearchForm
                onSearch={onSearch}
                defaultValue={defaultSearchText}
                inputProps={{ autoFocus: true, fullWidth: true }}
              />
            </DialogMain>
          </DialogBody>
        </DialogContainer>
      </DialogWrapper>
    </Dialog>
  );
};

export const SearchFormModal = (props: SearchFormModalProps): JSX.Element => {
  const { onSearch: propsOnSearch, onClose, ...delegated } = props;
  const onSearch: SearchFormModalDOMProps["onSearch"] = (text) => {
    propsOnSearch(text);
    onClose();
  };
  return (
    <SearchFormModalDOM onSearch={onSearch} onClose={onClose} {...delegated} />
  );
};
