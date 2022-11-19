import { configureStore } from '@reduxjs/toolkit'
import mediaFilesReducer from './plocs/media_files/reducer';

export const store = configureStore({
  reducer: {
    mediaFiles: mediaFilesReducer,
  },
});

type StoreState = ReturnType<typeof store.getState>;
export const selectStoreState = (state: StoreState) => state
