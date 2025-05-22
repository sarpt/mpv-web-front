import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LanIcon from '@mui/icons-material/Lan';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/styled-engine";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { checkConnection } from "ui/plocs/connection/actions";
import { selectConnectionCheckInProgress, selectConnectionInfo } from "ui/plocs/connection/selectors";
import { AddressInput } from "ui/pages/components/AddressInput";

export const ConnectionStatus = () => {
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
        connected={connection.connected}
        address={connection.address}
        editMode={editMode}
        onAbort={onAddressAbort}
        onAddressClick={() => setEditMode(true)}
        onSubmit={onAddressSubmit}
      />
      {
        connectionLoading
        ? <CircularProgress size='1em' />
        : connection.connected ? <CheckIcon color='success' /> : <ErrorIcon color='error' />
      }
    </ConnectionStatusContainer>
  );
};

const ConnectionStatusContainer = styled('span')`
  display: flex ;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
