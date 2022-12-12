import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";
import { fetchPlayback, playbackFetched, playbackFetchError, playMediaFile, subscribeToPlayback } from "./actions";
import { PlaybackSubscriptions } from '../../../../domains/playback/entities';

export const fetchPlaybackEffect = async (action: ReturnType<typeof fetchPlayback>, listenerApi: AppListenerEffectAPI) => {
  const fetchPlaybackUC = resolve(Dependencies.FetchPlaybackUC)();
  const { playback } = await fetchPlaybackUC.invoke();

  if (playback) {
    listenerApi.dispatch(playbackFetched(playback));
  } else {
    listenerApi.dispatch(playbackFetchError(''))
  }

  listenerApi.dispatch(subscribeToPlayback());
};

export const iterateOverMediaFilesChanges = (subscription: PlaybackSubscriptions['mediaFileChange'], listenerApi: AppListenerEffectAPI) => {
  return async () => {
    for await (const playback of subscription) {
      listenerApi.dispatch(playbackFetched(playback));
    }
  };
}

export const iterateOverPauseChanges = (subscription: PlaybackSubscriptions['pauseChange'], listenerApi: AppListenerEffectAPI) => {
  return async () => {
    for await (const mediaFiles of subscription) {
      listenerApi.dispatch(playbackFetched(mediaFiles));
    }
  }
}

export const subscribeToPlaybackEffect = async (action: ReturnType<typeof subscribeToPlayback>, listenerApi: AppListenerEffectAPI) => {
  const subscribeToMediaFilesUC = resolve(Dependencies.SubscribeToPlaybackUC)();
  const { subscriptions } = await subscribeToMediaFilesUC.invoke();

  listenerApi.fork(iterateOverMediaFilesChanges(subscriptions.mediaFileChange, listenerApi));
  listenerApi.fork(iterateOverPauseChanges(subscriptions.pauseChange, listenerApi));
}

export const playMediaFileEffect = async (action: ReturnType<typeof playMediaFile>, listenerApi: AppListenerEffectAPI) => {
  const playMediaFileUC = resolve(Dependencies.PlayMediaFileUC)();
  await playMediaFileUC.invoke(action.payload.mediaFilePath);
}
