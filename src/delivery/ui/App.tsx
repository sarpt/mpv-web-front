import { Provider } from 'react-redux';

import { AppLayout } from './common/layouts/AppLayout';
import { init } from './di';
import { store } from './store';
import { Routing } from '../../routing';

init();

export default function App() {
  return (
    <Provider store={store}>
      <AppLayout>
        <Routing />
      </AppLayout>
    </Provider>
  );
}
