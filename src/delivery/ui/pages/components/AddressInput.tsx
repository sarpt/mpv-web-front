import TextField from "@mui/material/TextField";
import { useCallback, useState } from "react";

type Props = {
  editMode: boolean,
  address: string,
  onAbort: () => void,
  onAddressClick: () => void,
  onSubmit: (newAddress: string) => void,
};

export const AddressInput = ({
  address,
  onAbort,
  onAddressClick,
  onSubmit,
  editMode
}: Props) => {
  const [newAddress, setNewAddress] = useState<string>(address);
  const abort = useCallback(() => {
    onAbort();
    setNewAddress(address);
  }, [address, onAbort])

  if (!editMode) {
    return (
      <span onClick={() => onAddressClick()}>{address}</span>
    );
  }

  return (
    <TextField
      label="MPV Web API Address"
      value={newAddress}
      autoFocus
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setNewAddress(event.target.value);
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          onSubmit(newAddress);
        } else if (event.key === 'Escape') {
          abort();
        }
      }}
      onBlur={() => abort()}
      size='small'
    />
  );
};
