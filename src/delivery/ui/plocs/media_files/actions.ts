import { createAction } from "@reduxjs/toolkit";
import { MediaFile } from "./models";

enum MediaFileActions {
  FetchMediaFiles = 'FetchMediaFiles',
  MediaFilesFetched = 'MediaFilesFetched',
  MediaFilesFetchError = 'MediaFilesFetchError',
  SubscribeToMediaFiles = 'SubscribeToMediaFiles',
}

export const fetchMediaFiles = createAction(MediaFileActions.FetchMediaFiles);

export const subscribeToMediaFiles = createAction(MediaFileActions.SubscribeToMediaFiles);

export const mediaFilesFetched = createAction(MediaFileActions.MediaFilesFetched, (mediaFiles: MediaFile[]) => {
  return {
    payload: {
      mediaFiles,
    },
  };
});

export const mediaFilesFetchError = createAction(MediaFileActions.MediaFilesFetched, (errMsg: string) => {
  return {
    payload: {
      errMsg,
    },
  };
});
