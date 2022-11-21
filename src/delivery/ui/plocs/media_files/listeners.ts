import { createListenerMiddleware } from "@reduxjs/toolkit";
import { fetchMediaFiles, mediaFilesFetched } from "./actions";
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

    listenerApi.dispatch(mediaFilesFetched(mediaFiles));
  },
});

export { mediaFilesListenerMiddleware };
