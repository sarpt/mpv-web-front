import { fetchMediaFiles, subscribeToMediaFiles } from "./plocs/media_files/actions";
import { fetchMediaFilesEffect, subscribeToMediaFilesEffect } from "./plocs/media_files/listeners";
import { fetchPlayback, pause, playMediaFile, subscribeToPlayback } from "./plocs/playback/actions";
import { changePauseEffect, fetchPlaybackEffect, playMediaFileEffect, subscribeToPlaybackEffect } from "./plocs/playback/listeners";
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

  startAppListening({
    actionCreator: fetchPlayback,
    effect: fetchPlaybackEffect 
  });

  startAppListening({
    actionCreator: subscribeToPlayback,
    effect: subscribeToPlaybackEffect,
  });

  startAppListening({
    actionCreator: playMediaFile,
    effect: playMediaFileEffect,
  });

  startAppListening({
    actionCreator: pause,
    effect: changePauseEffect,
  });

  return appListenersMiddleware;
}
