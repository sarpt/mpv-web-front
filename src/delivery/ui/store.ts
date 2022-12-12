import {
  configureStore,
} from '@reduxjs/toolkit'
import { initListeners } from './listeners';
import { reducers } from './reducers';

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware({
      serializableCheck: false, // this and the one below cause quite a big slowdown in dev mode
      immutableCheck: false,
    });
  
    return defaultMiddleware.prepend(initListeners().middleware);
  },
});

