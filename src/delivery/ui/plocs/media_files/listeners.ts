import { createListenerMiddleware } from "@reduxjs/toolkit";
import { fetchMediaFiles, mediaFilesAdded, subscribeToMediaFiles } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';

const mediaFilesListenerMiddleware = createListenerMiddleware();

mediaFilesListenerMiddleware.startListening({
  actionCreator: fetchMediaFiles,
  effect: async (action, listenerApi) => {
    const fetchMediaFilesUC = resolve(Dependencies.FetchMediaFilesUC)();
    const { mediaFiles } = await fetchMediaFilesUC.invoke();

    listenerApi.dispatch(mediaFilesAdded(mediaFiles));

    // TODO: this probably should not be here (maybe as an option to action?), test only
    listenerApi.dispatch(subscribeToMediaFiles());
  },
});

mediaFilesListenerMiddleware.startListening({
  actionCreator: subscribeToMediaFiles,
  effect: async (action, listenerApi) => {
    const subscribeToMediaFilesUC = resolve(Dependencies.SubscribeToMediaFilesUC)();
    const { subscription } = await subscribeToMediaFilesUC.invoke();

    listenerApi.fork(async () => {
      for await (const mediaFiles of subscription) {
        listenerApi.dispatch(mediaFilesAdded(mediaFiles));
      }
    });
  },
});

export { mediaFilesListenerMiddleware };
