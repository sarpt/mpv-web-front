import { fetchMediaFiles, mediaFilesAdded, mediaFilesRemoved, subscribeToMediaFiles } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { MediaFilesSubscriptions } from "../../../../domains/media_files/entities";
import { AppListenerEffectAPI } from "../../reducers";

export const fetchMediaFilesEffect = async (action: ReturnType<typeof fetchMediaFiles>, listenerApi: AppListenerEffectAPI) => {
  const fetchMediaFilesUC = resolve(Dependencies.FetchMediaFilesUC)();
  const { mediaFiles } = await fetchMediaFilesUC.invoke();

  listenerApi.dispatch(mediaFilesAdded(mediaFiles));

  // TODO: this probably should not be here (maybe as an option to action?), test only
  listenerApi.dispatch(subscribeToMediaFiles());
};

export const iterateOverAddedMediaFiles = (subscription: MediaFilesSubscriptions['added'], listenerApi: AppListenerEffectAPI) => {
  return async () => {
    for await (const mediaFiles of subscription) {
      listenerApi.dispatch(mediaFilesAdded(mediaFiles));
    }
  };
}

export const iterateOverRemovedMediaFiles = (subscription: MediaFilesSubscriptions['removed'], listenerApi: AppListenerEffectAPI) => {
  return async () => {
    for await (const mediaFiles of subscription) {
      listenerApi.dispatch(mediaFilesRemoved(mediaFiles));
    }
  }
}

export const subscribeToMediaFilesEffect = async (action: ReturnType<typeof subscribeToMediaFiles>, listenerApi: AppListenerEffectAPI) => {
  const subscribeToMediaFilesUC = resolve(Dependencies.SubscribeToMediaFilesUC)();
  const { subscriptions } = await subscribeToMediaFilesUC.invoke();

  listenerApi.fork(iterateOverAddedMediaFiles(subscriptions.added, listenerApi));
  listenerApi.fork(iterateOverRemovedMediaFiles(subscriptions.removed, listenerApi));
}
