import { PageViewport } from '../components/PageViewport';
import { Footer } from '../components/Footer';
import { AppContainer } from '../components/AppContainer';

export const AppLayout = () => {
  return (
    <AppContainer>
      <PageViewport />
      <Footer />
    </AppContainer>
  );
}
