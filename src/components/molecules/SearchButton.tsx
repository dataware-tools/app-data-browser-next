import {
  SearchFormModal,
  SearchFormModalProps,
} from "components/molecules/SearchFormModal";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { useState } from "react";
export type SearchButtonDOMProps = {
  onOpenSearchFormModal: () => void;
  isOpenSearchFormModal: boolean;
  onCloseSearchFormModal: () => void;
} & SearchButtonProps;

export type SearchButtonProps = {
  onSearch: (searchText: string) => void;
  defaultSearchText: SearchFormModalProps["defaultSearchText"];
};

export const SearchButtonDOM = (props: SearchButtonDOMProps): JSX.Element => {
  const {
    onSearch,
    onOpenSearchFormModal,
    defaultSearchText,
    isOpenSearchFormModal,
    onCloseSearchFormModal,
  } = props;
  return (
    <>
      <IconButton onClick={onOpenSearchFormModal} size="small">
        <SearchIcon />
      </IconButton>
      <SearchFormModal
        open={isOpenSearchFormModal}
        onClose={onCloseSearchFormModal}
        defaultSearchText={defaultSearchText}
        onSearch={onSearch}
      />
    </>
  );
};

export const SearchButton = (props: SearchButtonProps): JSX.Element => {
  const [isOpenSearchFormModal, setIsOpenSearchFormModal] = useState(false);
  return (
    <SearchButtonDOM
      isOpenSearchFormModal={isOpenSearchFormModal}
      onOpenSearchFormModal={() => setIsOpenSearchFormModal(true)}
      onCloseSearchFormModal={() => setIsOpenSearchFormModal(false)}
      {...props}
    />
  );
};
