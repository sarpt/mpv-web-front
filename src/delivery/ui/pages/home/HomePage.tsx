import { styled } from "@mui/material";
import { AppVersion } from "ui/pages/components/AppVersion";

import { ConnectionStatus } from "ui/pages/components/ConnectionStatus";
import { QuickLinks } from "ui/pages/components/QuickLinks";

export const HomePage = () => {
  return (
    <PageBase>
      <Title>MPV Web Front</Title>
      <AppVersion />
      <ConnectionStatus />
      <QuickLinks />
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
`;
