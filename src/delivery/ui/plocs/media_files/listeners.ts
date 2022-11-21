import { createListenerMiddleware } from "@reduxjs/toolkit";
import { fetchMediaFiles, mediaFilesFetched } from "./actions";
import {
  resolve as mediaFilesResolve,
  Dependencies as MediaFilesDependencies
} from '../../../../domains/media_files/di';

const mediaFilesListenerMiddleware = createListenerMiddleware();

mediaFilesListenerMiddleware.startListening({
  actionCreator: fetchMediaFiles,
  effect: async (action, listenerApi) => {
    const fetchMediaFilesUC = mediaFilesResolve(MediaFilesDependencies.FetchMediaFilesUC)();
    const { mediaFiles } = await fetchMediaFilesUC.invoke();

    listenerApi.dispatch(mediaFilesFetched(mediaFiles));
  },
});

export { mediaFilesListenerMiddleware };
