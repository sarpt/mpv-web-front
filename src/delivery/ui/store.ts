import { configureStore } from '@reduxjs/toolkit'
import { mediaFilesListenerMiddleware } from './plocs/media_files/listeners';
import mediaFilesReducer from './plocs/media_files/reducer';

const allListeners = [
  mediaFilesListenerMiddleware.middleware,
];

export const store = configureStore({
  reducer: {
    mediaFiles: mediaFilesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
  
    return defaultMiddleware.prepend(allListeners);
  },
});

type StoreState = ReturnType<typeof store.getState>;
export const selectStoreState = (state: StoreState) => state
