import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";
import { changeAudio, changeSubtitles, fetchPlayback, fullscreen, loadPlaylist, loop, pause, playbackFetched, playbackFetchError, playMediaFile, subscribeToPlayback, unsubscribeToPlayback } from "./actions";

export const fetchPlaybackEffect = async (_action: ReturnType<typeof fetchPlayback>, listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaybackRepository)();
  const playback = await repo.fetchPlayback();

  if (playback) {
    listenerApi.dispatch(playbackFetched(playback));
  } else {
    listenerApi.dispatch(playbackFetchError(''))
  }
};

const playbackPollTimeoutMs = 200;
export const subscribeToPlaybackEffect = async (_action: ReturnType<typeof subscribeToPlayback>, listenerApi: AppListenerEffectAPI) => {
    listenerApi.unsubscribe()

    const pollingTask = listenerApi.fork(async (forkApi) => {
      while (true) {
        await forkApi.delay(playbackPollTimeoutMs)

        listenerApi.dispatch(fetchPlayback());
      }
    })

    await listenerApi.condition(unsubscribeToPlayback.match);
    pollingTask.cancel();
}

export const playMediaFileEffect = async (action: ReturnType<typeof playMediaFile>, _listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaybackRepository)();
  await repo.playMediaFile(action.payload.mediaFilePath, {
    append: action.payload.append,
    audioId: action.payload.audioId,
    subtitleId: action.payload.subtitleId,
    loopVariant: action.payload.loopVariant,
  });
}

export const loadPlaylistEffect = async (action: ReturnType<typeof loadPlaylist>, _listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaybackRepository)();
  await repo.loadPlaylist(action.payload.uuid);
}

export const changeAudioEffect = async (action: ReturnType<typeof changeAudio>, _listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaybackRepository)();
  await repo.changeAudio(action.payload.audioId);
}

export const changeSubtitlesEffect = async (action: ReturnType<typeof changeSubtitles>, _listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaybackRepository)();
  await repo.changeSubtitles(action.payload.subtitleId);
}

export const changePauseEffect = async (action: ReturnType<typeof pause>, _listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaybackRepository)();
  await repo.setPause(action.payload.paused);
}

export const loopEffect = async (action: ReturnType<typeof loop>, _listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaybackRepository)();
  await repo.setLoopFile(action.payload.variant);
}

export const fullscreenEffect = async (action: ReturnType<typeof fullscreen>, _listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaybackRepository)();
  await repo.setFullscreen(action.payload.enabled);
}
