import { TextField } from "@mui/material";

type Props = {
  open: boolean;
  value: string;
  onSearch: (val: string) => void;
  abort: () => void;
};

export const SearchBar = (props: Props) => {
  return (
    <TextField
      label="Search"
      value={props.value}
      autoFocus
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        props.onSearch(event.target.value);
      }}
      size='small'
    />
  );
};
