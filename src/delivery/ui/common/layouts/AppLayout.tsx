import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { PageViewport } from 'ui/common/components/App/PageViewport';
import { PlaybackSummary } from 'ui/pages/playback/PlaybackSummary';
import { AppSidebar } from 'ui/common/components/App/Sidebar';
import { Footer } from 'ui/common/components/App/Footer';
import { AppContainer } from 'ui/common/components/App/Container';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppContainer>
      <AppSidebar open={sidebarOpen} changeOpen={setSidebarOpen} />
      <PageViewport>
        <Outlet />
      </PageViewport>
      <Footer>
        <PlaybackSummary onMenuClick={() => setSidebarOpen(true)} />
      </Footer>
    </AppContainer>
  );
}
