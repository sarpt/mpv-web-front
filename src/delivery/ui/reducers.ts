import { addListener, createListenerMiddleware, Dispatch, ListenerEffectAPI, StateFromReducersMapObject, TypedAddListener, TypedStartListening, UnknownAction } from "@reduxjs/toolkit";
import mediaFilesReducer from "./plocs/media_files/reducer";
import playbackReducer from "./plocs/playback/reducer";
import playlistsReducer from "./plocs/playlists/reducer";
import connectionReducer from "ui/plocs/connection/reducer";
import packagesReducer from "ui/plocs/packages/reducer";

export const reducers = {
  connections: connectionReducer,
  mediaFiles: mediaFilesReducer,
  playback: playbackReducer,
  playlists: playlistsReducer,
  packages: packagesReducer,
};

export type RootState = StateFromReducersMapObject<typeof reducers>;
export type AppDispatch = Dispatch<UnknownAction>;

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type AppAddListener = TypedAddListener<RootState>

export const appListenersMiddleware = createListenerMiddleware();
export const startAppListening =
  appListenersMiddleware.startListening as AppStartListening;
export const addAppListener = addListener as AppAddListener;

export const selectStoreState = (state: RootState) => state