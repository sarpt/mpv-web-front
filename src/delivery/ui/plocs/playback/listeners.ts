import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";
import { fetchPlayback, fullscreen, loop, pause, playbackFetched, playbackFetchError, playMediaFile, subscribeToPlayback, unsubscribeToPlayback } from "./actions";

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

export const loopEffect = async (action: ReturnType<typeof loop>, listenerApi: AppListenerEffectAPI) => {
  const loopUC = resolve(Dependencies.LoopUC)();
  await loopUC.invoke(action.payload.variant);
}

export const fullscreenEffect = async (action: ReturnType<typeof fullscreen>, listenerApi: AppListenerEffectAPI) => {
  const fullscreenUC = resolve(Dependencies.FullscreenUC)();
  await fullscreenUC.invoke(action.payload.enabled);
}
