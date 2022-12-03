import {
  addListener,
  configureStore,
  createListenerMiddleware,
  ListenerEffectAPI,
  TypedAddListener,
  TypedStartListening
} from '@reduxjs/toolkit'
import mediaFilesReducer from './plocs/media_files/reducer';

const appListenersMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    mediaFiles: mediaFilesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
  
    return defaultMiddleware.prepend(appListenersMiddleware.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type AppAddListener = TypedAddListener<RootState>

export const startAppListening =
  appListenersMiddleware.startListening as AppStartListening
export const addAppListener = addListener as AppAddListener

export const selectStoreState = (state: RootState) => state
