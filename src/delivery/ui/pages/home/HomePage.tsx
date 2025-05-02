import { CircularProgress, styled } from "@mui/material";
import LanIcon from '@mui/icons-material/Lan';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

import { useSelector } from "react-redux";

import { selectConnectionCheckInProgress, selectConnectionInfo } from "ui/plocs/connection/selectors";

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
  const connection = useSelector(selectConnectionInfo);
  const connectionLoading = useSelector(selectConnectionCheckInProgress);

  return (
    <ConnectionStatusContainer>
      <LanIcon />{connection.address} {
        connectionLoading
        ? <CircularProgress size='1em' />
        : connection.connected ? <CheckIcon /> : <ErrorIcon /> }
    </ConnectionStatusContainer>
  );
};
