import { Provider } from 'react-redux';

import { AppLayout } from './common/layouts/AppLayout';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
}
