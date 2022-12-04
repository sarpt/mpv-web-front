import {
  configureStore,
} from '@reduxjs/toolkit'
import { initListeners } from './listeners';
import { reducers, RootState } from './reducers';


export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
  
    return defaultMiddleware.prepend(initListeners().middleware);
  },
});

export const selectStoreState = (state: RootState) => state
