import { Provider } from 'react-redux';

import { init } from './di';
import { store } from './store';
import { Routing } from '../../routing';

init();

export default function App() {
  return (
    <Provider store={store}>
      <Routing />
    </Provider>
  );
}
