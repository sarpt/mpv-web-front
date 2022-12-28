import { createAction } from "@reduxjs/toolkit";
import { MediaFilesMap } from "./models";

enum MediaFileActions {
  FetchMediaFiles = 'FetchMediaFiles',
  MediaFilesFetched = 'MediaFilesFetched',
  MediaFilesFetchError = 'MediaFilesFetchError',
  SubscribeToMediaFiles = 'SubscribeToMediaFiles',
  UnsubscribeToMediaFiles = 'UnsubscribeToMediaFiles',
}

export const fetchMediaFiles = createAction(MediaFileActions.FetchMediaFiles);

export const subscribeToMediaFiles = createAction(MediaFileActions.SubscribeToMediaFiles);

export const unsubscribeToMediaFiles = createAction(MediaFileActions.UnsubscribeToMediaFiles);

export const mediaFilesFetched = createAction(MediaFileActions.MediaFilesFetched, (mediaFiles: MediaFilesMap) => {
  return {
    payload: {
      mediaFiles,
    },
  };
});

export const mediaFilesFetchError = createAction(MediaFileActions.MediaFilesFetchError, (errMsg: string) => {
  return {
    payload: {
      errMsg,
    },
  };
});
