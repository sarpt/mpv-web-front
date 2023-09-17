import { fetchMediaFiles, subscribeToMediaFiles } from "./plocs/media_files/actions";
import { fetchMediaFilesEffect, subscribeToMediaFilesEffect } from "./plocs/media_files/listeners";
import { changeAudio, changeSubtitles, fetchPlayback, fullscreen, loop, pause, playMediaFile, subscribeToPlayback } from "./plocs/playback/actions";
import { changeAudioEffect, changePauseEffect, changeSubtitlesEffect, fetchPlaybackEffect, fullscreenEffect, loopEffect, playMediaFileEffect, subscribeToPlaybackEffect } from "./plocs/playback/listeners";
import { fetchPlaylists } from "./plocs/playlists/actions";
import { fetchPlaylistsEffect } from "./plocs/playlists/listeners";
import { appListenersMiddleware, startAppListening } from "./reducers";

export function initListeners() {
  startAppListening({
    actionCreator: fetchMediaFiles,
    effect: fetchMediaFilesEffect
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
    actionCreator: fetchPlayback,
    effect: fetchPlaybackEffect 
  });

  startAppListening({
    actionCreator: fetchPlaylists,
    effect: fetchPlaylistsEffect
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

  return appListenersMiddleware;
}
