import { fetchMediaFiles, subscribeToMediaFiles } from "./plocs/media_files/actions";
import { fetchMediaFilesEffect, subscribeToMediaFilesEffect } from "./plocs/media_files/listeners";
import { appListenersMiddleware, startAppListening } from "./reducers";

export function initListeners() {
  startAppListening({
    actionCreator: fetchMediaFiles,
    effect: fetchMediaFilesEffect
  });

  startAppListening({
    actionCreator: subscribeToMediaFiles,
    effect: subscribeToMediaFilesEffect,
  });

  return appListenersMiddleware;
}

