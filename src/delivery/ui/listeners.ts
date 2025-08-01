import { checkConnection, connectionFailed } from "ui/plocs/connection/actions";
import { subscribeToMediaFiles } from "./plocs/media_files/actions";
import { subscribeToMediaFilesEffect } from "./plocs/media_files/listeners";
import { changeAudio, changeSubtitles, fullscreen, loadPlaylist, loop, pause, playMediaFile, subscribeToPlayback } from "./plocs/playback/actions";
import { changeAudioEffect, changePauseEffect, changeSubtitlesEffect, fullscreenEffect, loadPlaylistEffect, loopEffect, playMediaFileEffect, subscribeToPlaybackEffect } from "./plocs/playback/listeners";
import { subscribeToPlaylists } from "./plocs/playlists/actions";
import { subscribeToPlaylistsEffect } from "./plocs/playlists/listeners";
import { appListenersMiddleware, startAppListening } from "./reducers";
import { checkConnectionEffect, scheduleNextConnectionCheck } from "ui/plocs/connection/listeners";
import { checkLatestFrontendRelease, updateFrontend } from "ui/plocs/packages/actions";
import { checkLatestFrontendReleaseEffect, updateFrontendEffect } from "ui/plocs/packages/listeners";

export function initListeners() {
  startAppListening({
    actionCreator: checkConnection,
    effect: checkConnectionEffect
  });

  startAppListening({
    actionCreator: connectionFailed,
    effect: scheduleNextConnectionCheck
  });

  startAppListening({
    actionCreator: changeAudio,
    effect: changeAudioEffect 
  });

  startAppListening({
    actionCreator: changeSubtitles,
    effect: changeSubtitlesEffect 
  });

  startAppListening({
    actionCreator: subscribeToMediaFiles,
    effect: subscribeToMediaFilesEffect,
  });

  startAppListening({
    actionCreator: subscribeToPlaylists,
    effect: subscribeToPlaylistsEffect,
  });

  startAppListening({
    actionCreator: loadPlaylist,
    effect: loadPlaylistEffect 
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

  startAppListening({
    actionCreator: fullscreen,
    effect: fullscreenEffect,
  });

  startAppListening({
    actionCreator: loop,
    effect: loopEffect,
  });

  startAppListening({
    actionCreator: checkLatestFrontendRelease,
    effect: checkLatestFrontendReleaseEffect,
  });

  startAppListening({
    actionCreator: updateFrontend,
    effect: updateFrontendEffect,
  });

  return appListenersMiddleware;
}
