import { fetchMediaFiles, mediaFilesFetched, subscribeToMediaFiles, unsubscribeToMediaFiles } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";

export const fetchMediaFilesEffect = async (action: ReturnType<typeof fetchMediaFiles>, listenerApi: AppListenerEffectAPI) => {
  const fetchMediaFilesUC = resolve(Dependencies.FetchMediaFilesUC)();
  const { mediaFiles } = await fetchMediaFilesUC.invoke();

  listenerApi.dispatch(mediaFilesFetched(mediaFiles));
};

const mediaFilesPollTimeoutMs = 5000;
export const subscribeToMediaFilesEffect = async (action: ReturnType<typeof subscribeToMediaFiles>, listenerApi: AppListenerEffectAPI) => {
    listenerApi.unsubscribe()

    const pollingTask = listenerApi.fork(async (forkApi) => {
      while (true) {
        listenerApi.dispatch(fetchMediaFiles());

        await forkApi.delay(mediaFilesPollTimeoutMs)
      }
    })

    await listenerApi.condition(unsubscribeToMediaFiles.match);
    pollingTask.cancel();
}
