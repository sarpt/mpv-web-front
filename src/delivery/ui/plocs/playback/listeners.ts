import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";
import { fetchPlayback, pause, playbackFetched, playbackFetchError, playMediaFile, subscribeToPlayback, unsubscribeToPlayback } from "./actions";

export const fetchPlaybackEffect = async (action: ReturnType<typeof fetchPlayback>, listenerApi: AppListenerEffectAPI) => {
  const fetchPlaybackUC = resolve(Dependencies.FetchPlaybackUC)();
  const { playback } = await fetchPlaybackUC.invoke();

  if (playback) {
    listenerApi.dispatch(playbackFetched(playback));
  } else {
    listenerApi.dispatch(playbackFetchError(''))
  }
};

const playbackPollTimeoutMs = 200;
export const subscribeToPlaybackEffect = async (action: ReturnType<typeof subscribeToPlayback>, listenerApi: AppListenerEffectAPI) => {
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

export const playMediaFileEffect = async (action: ReturnType<typeof playMediaFile>, listenerApi: AppListenerEffectAPI) => {
  const playMediaFileUC = resolve(Dependencies.PlayMediaFileUC)();
  await playMediaFileUC.invoke(action.payload.mediaFilePath);
}

export const changePauseEffect = async (action: ReturnType<typeof pause>, listenerApi: AppListenerEffectAPI) => {
  const pauseUC = resolve(Dependencies.PauseUC)();
  await pauseUC.invoke(action.payload.paused);
}
