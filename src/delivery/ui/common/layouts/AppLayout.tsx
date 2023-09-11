import { PageViewport } from '../components/PageViewport';
import { Footer } from '../components/Footer';
import { AppContainer } from '../components/AppContainer';
import { PlaybackSummary } from '../../pages/playback/PlaybackSummary';
import { FC, PropsWithChildren } from 'react';

export const AppLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <AppContainer>
      <PageViewport>
        {children}
      </PageViewport>
      <Footer>
        <PlaybackSummary />
      </Footer>
    </AppContainer>
  );
}
