import { 
  fetchMediaFiles,
  mediaFilesAdded, 
  mediaFilesFetched, 
  mediaFilesFetchError,
  mediaFilesRemoved,
  subscribeToMediaFiles,
  unsubscribeToMediaFiles
} from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";

export const fetchMediaFilesEffect = async (_action: ReturnType<typeof fetchMediaFiles>, listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.MediaFilesRepository)();
  const mediaFiles = await repo.fetchMediaFiles();

  listenerApi.dispatch(mediaFilesFetched(mediaFiles));
};

export const subscribeToMediaFilesEffect = async (_action: ReturnType<typeof subscribeToMediaFiles>, listenerApi: AppListenerEffectAPI) => {
    listenerApi.unsubscribe()

    const repo = resolve(Dependencies.MediaFilesRepository)();
    const mediaFilesIteratorResult = repo.iterateMediaFiles();
    if (mediaFilesIteratorResult.isErr()) {
      listenerApi.dispatch(mediaFilesFetchError("could not start subscription to media files events"));
      return;
    }

    const mediaFilesIterator = mediaFilesIteratorResult.ok();
    const mediaFilesPollingTask = listenerApi.fork(async () => {
      for await (const mediaFilesEvent of mediaFilesIterator) {
        if (mediaFilesEvent.name === 'mediaFiles.added') {
          listenerApi.dispatch(mediaFilesAdded(mediaFilesEvent.payload));
        } else if (mediaFilesEvent.name === 'mediaFiles.removed') {
          listenerApi.dispatch(mediaFilesRemoved(mediaFilesEvent.payload));
        }
      }
    });

    // fetch initial state of media files
    // TODO: could be replaced with a "replay" event but that probably could be implemented better
    // with aggregation of event iterators
    listenerApi.dispatch(fetchMediaFiles());

    await listenerApi.condition(unsubscribeToMediaFiles.match);
    mediaFilesPollingTask.cancel();
}
