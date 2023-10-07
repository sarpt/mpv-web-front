import { PageViewport } from '../components/App/PageViewport';
import { Footer } from '../components/App/Footer';
import { AppContainer } from '../components/App/Container';
import { PlaybackSummary } from '../../pages/playback/PlaybackSummary';
import { useState } from 'react';
import { AppSidebar } from '../components/App/Sidebar';
import { Outlet } from 'react-router-dom';

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
