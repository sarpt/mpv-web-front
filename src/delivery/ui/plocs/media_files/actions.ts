import { createAction } from "@reduxjs/toolkit";
import { MediaFilesMap } from "./models";

enum MediaFileActions {
  FetchMediaFiles = 'FetchMediaFiles',
  MediaFilesAdded = 'MediaFilesAdded',
  MediaFilesFetchError = 'MediaFilesFetchError',
  SubscribeToMediaFiles = 'SubscribeToMediaFiles',
}

export const fetchMediaFiles = createAction(MediaFileActions.FetchMediaFiles);

export const subscribeToMediaFiles = createAction(MediaFileActions.SubscribeToMediaFiles);

export const mediaFilesAdded = createAction(MediaFileActions.MediaFilesAdded, (mediaFiles: MediaFilesMap) => {
  return {
    payload: {
      mediaFiles,
    },
  };
});

export const mediaFilesFetchError = createAction(MediaFileActions.MediaFilesAdded, (errMsg: string) => {
  return {
    payload: {
      errMsg,
    },
  };
});
