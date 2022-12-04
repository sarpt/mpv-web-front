import { addListener, AnyAction, createListenerMiddleware, Dispatch, ListenerEffectAPI, StateFromReducersMapObject, TypedAddListener, TypedStartListening } from "@reduxjs/toolkit";
import mediaFilesReducer from "./plocs/media_files/reducer";

export const reducers = {
  mediaFiles: mediaFilesReducer,
};

export type RootState = StateFromReducersMapObject<typeof reducers>;
export type AppDispatch = Dispatch<AnyAction>;

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type AppAddListener = TypedAddListener<RootState>

export const appListenersMiddleware = createListenerMiddleware();
export const startAppListening =
  appListenersMiddleware.startListening as AppStartListening;
export const addAppListener = addListener as AppAddListener;