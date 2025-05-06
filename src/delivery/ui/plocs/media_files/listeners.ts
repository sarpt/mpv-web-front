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
    const addedFilesIteratorResult = repo.iterateAddedMediaFiles();
    const removedFilesIteratorResult = repo.iterateRemovedMediaFiles();
    if (addedFilesIteratorResult.isErr() || removedFilesIteratorResult.isErr()) {
      listenerApi.dispatch(mediaFilesFetchError("could not start subscription to media files events"));
      return;
    }

    const addedFilesIterator = addedFilesIteratorResult.ok();
    const removedFilesIterator = addedFilesIteratorResult.ok();

    // TODO: the logic below could be abstracted such that event observer aggregates results of both iterators
    const addedFilesPollingTask = listenerApi.fork(async () => {
      for await (const addedMediaFiles of addedFilesIterator) {
        listenerApi.dispatch(mediaFilesAdded(addedMediaFiles));
      }
    });

    const removedFilesPollingTask = listenerApi.fork(async () => {
      for await (const removedMediaFiles of removedFilesIterator) {
        listenerApi.dispatch(mediaFilesRemoved(removedMediaFiles));
      }
    });

    // fetch initial state of media files
    // TODO: could be replaced with a "replay" event but that probably could be implemented better
    // with aggregation of event iterators
    listenerApi.dispatch(fetchMediaFiles());

    await listenerApi.condition(unsubscribeToMediaFiles.match);
    addedFilesPollingTask.cancel();
    removedFilesPollingTask.cancel();
}
