import { PageViewport } from '../components/PageViewport';
import { Footer } from '../components/Footer';
import { AppContainer } from '../components/AppContainer';
import { MediaFilesPage } from '../../pages/media_files/MediaFilesPage';

export const AppLayout = () => {
  return (
    <AppContainer>
      <PageViewport>
        <MediaFilesPage />
      </PageViewport>
      <Footer />
    </AppContainer>
  );
}
