import { 
  mediaFilesAdded, 
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
import { MediaFilesEvents } from "src/domains/media_files/interfaces";

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
        if (mediaFilesEvent.eventVariant === MediaFilesEvents.Added) {
          listenerApi.dispatch(mediaFilesAdded(mediaFilesEvent.payload));
        } else if (mediaFilesEvent.eventVariant === MediaFilesEvents.Removed) {
          listenerApi.dispatch(mediaFilesRemoved(mediaFilesEvent.payload));
        }
      }
    });

    await listenerApi.condition(unsubscribeToMediaFiles.match);
    mediaFilesPollingTask.cancel();
}
