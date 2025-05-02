import * as React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { init } from 'ui/di';
import { store } from 'ui/store';
import { Main } from 'ui/Main';

init();

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Provider store={store}>
      <Main />
    </Provider>
  </React.Fragment>,
  document.getElementById('root'),
);
