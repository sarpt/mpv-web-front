import { PlaybackEvents } from 'src/domains/playback/interfaces';
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";
import {
  changeAudio,
  changeSubtitles,
  fullscreen,
  loadPlaylist,
  loop,
  pause,
  playbackFetched,
  playbackFetchError,
  playMediaFile,
  subscribeToPlayback,
  unsubscribeToPlayback
} from "./actions";

export const subscribeToPlaybackEffect = async (_action: ReturnType<typeof subscribeToPlayback>, listenerApi: AppListenerEffectAPI) => {
  listenerApi.unsubscribe()

  const repo = resolve(Dependencies.PlaybackRepository)();
  const playbackIteratorResult = repo.iteratePlayback();
  if (playbackIteratorResult.isErr()) {
    listenerApi.dispatch(playbackFetchError("could not start subscription to media files events"));
    return;
  }

  const playbackIterator = playbackIteratorResult.ok();
  const playbackPollingTask = listenerApi.fork(async () => {
    for await (const playbackEvent of playbackIterator) {
      if (
        playbackEvent.eventVariant === PlaybackEvents.AudioIdChange ||
        playbackEvent.eventVariant === PlaybackEvents.CurrentChapterIndexChange ||
        playbackEvent.eventVariant === PlaybackEvents.FullscreenChange ||
        playbackEvent.eventVariant === PlaybackEvents.LoopFileChange ||
        playbackEvent.eventVariant === PlaybackEvents.MediaFileChange ||
        playbackEvent.eventVariant === PlaybackEvents.PauseChange ||
        playbackEvent.eventVariant === PlaybackEvents.PlaybackTimeChange ||
        playbackEvent.eventVariant === PlaybackEvents.PlaylistCurrentIdxChange ||
        playbackEvent.eventVariant === PlaybackEvents.PlaylistSelectionChange ||
        playbackEvent.eventVariant === PlaybackEvents.Replay ||
        playbackEvent.eventVariant === PlaybackEvents.SubtitleIdChange
      ) {
        listenerApi.dispatch(playbackFetched(playbackEvent.payload));
      }
    }
  });

  await listenerApi.condition(unsubscribeToPlayback.match);
  playbackPollingTask.cancel();
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
