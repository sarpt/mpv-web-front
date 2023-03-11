import { PageViewport } from '../components/PageViewport';
import { Footer } from '../components/Footer';
import { AppContainer } from '../components/AppContainer';
import { MediaFilesPage } from '../../pages/media_files/MediaFilesPage';
import { PlaybackSummary } from '../../pages/playback/PlaybackSummary';

export const AppLayout = () => {
  return (
    <AppContainer>
      <PageViewport>
        <MediaFilesPage />
      </PageViewport>
      <Footer>
        <PlaybackSummary />
      </Footer>
    </AppContainer>
  );
}
