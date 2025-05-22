import { Button, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectConnectionInfo } from "ui/plocs/connection/selectors";
import { navigationEntries } from "ui/plocs/navigation/entries";

export const QuickLinks = () => {
  const connection = useSelector(selectConnectionInfo);
  const navigate = useNavigate();

  return (
    <Container>
      <Button
        disabled={!connection.connected}
        startIcon={navigationEntries.MediaFiles.icon}
        onClick={() => navigate(navigationEntries.MediaFiles.route)}
      >
        {navigationEntries.MediaFiles.title}
      </Button>
      <Button
        disabled={!connection.connected}
        startIcon={navigationEntries.Playlists.icon}
        onClick={() => navigate(navigationEntries.Playlists.route)}
      >
        {navigationEntries.Playlists.title}
      </Button>
    </Container>
  );
}; 

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
