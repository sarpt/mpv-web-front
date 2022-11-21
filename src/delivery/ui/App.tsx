import { Provider } from 'react-redux';

import { AppLayout } from './common/layouts/AppLayout';
import { init } from './di';
import { store } from './store';

init();

export default function App() {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
}
