import { CircularProgress, IconButton, styled, TextField } from "@mui/material";
import LanIcon from '@mui/icons-material/Lan';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

import { useDispatch, useSelector } from "react-redux";

import { selectConnectionCheckInProgress, selectConnectionInfo } from "ui/plocs/connection/selectors";
import { EditOffOutlined, EditOutlined } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { checkConnection } from "ui/plocs/connection/actions";

export const HomePage = () => {
  return (
    <PageBase>
      <Title>MPV Web Front</Title>
      <ConnectionStatus />
    </PageBase>
  );
}

const PageBase = styled('div')`
  height: 100%;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Title = styled('span')`
  font-size: 32px;
  font-weight: bold;
`

const ConnectionStatusContainer = styled('span')`
  display: flex ;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ConnectionStatus = () => {
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState<boolean>(false);
  const connection = useSelector(selectConnectionInfo);
  const connectionLoading = useSelector(selectConnectionCheckInProgress);

  const editButtonIcon = editMode ? <EditOffOutlined /> : <EditOutlined />;
  const onAddressSubmit = (newAddress: string) => {
    dispatch(checkConnection(newAddress));
    setEditMode(false);
  };
  const onAddressAbort = () => {
    setEditMode(false);
  };

  return (
    <ConnectionStatusContainer>
      <IconButton color="primary" onClick={() => setEditMode(!editMode)}>
        {
          editButtonIcon
        }
      </IconButton>
      <LanIcon />
      <AddressInput
        address={connection.address}
        editMode={editMode}
        onAbort={onAddressAbort}
        onAddressClick={() => setEditMode(true)}
        onSubmit={onAddressSubmit}
      />
      {
        connectionLoading
        ? <CircularProgress size='1em' />
        : connection.connected ? <CheckIcon /> : <ErrorIcon />
      }
    </ConnectionStatusContainer>
  );
};

type AddressInputProps = {
  editMode: boolean,
  address: string,
  onAbort: () => void,
  onAddressClick: () => void,
  onSubmit: (newAddress: string) => void,
};
const AddressInput = ({
  address,
  onAbort,
  onAddressClick,
  onSubmit,
  editMode
}: AddressInputProps) => {
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