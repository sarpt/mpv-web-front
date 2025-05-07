import { createAction } from "@reduxjs/toolkit";
import { MediaFilesMap } from "src/domains/media_files/entities";

enum MediaFileActions {
  MediaFilesFetchError = 'MediaFilesFetchError',
  MediaFilesAdded = 'MediaFilesAdded',
  MediaFilesRemoved = 'MediaFilesRemoved',
  SubscribeToMediaFiles = 'SubscribeToMediaFiles',
  UnsubscribeToMediaFiles = 'UnsubscribeToMediaFiles',
  FocusOnMediaFile = 'FocusOnMediaFile'
}

export const subscribeToMediaFiles = createAction(MediaFileActions.SubscribeToMediaFiles);

export const unsubscribeToMediaFiles = createAction(MediaFileActions.UnsubscribeToMediaFiles);

export const mediaFilesAdded = createAction(MediaFileActions.MediaFilesAdded, (added: MediaFilesMap) => {
  return {
    payload: {
      added,
    },
  };
});

export const mediaFilesRemoved = createAction(MediaFileActions.MediaFilesRemoved, (removed: MediaFilesMap) => {
  return {
    payload: {
      removed,
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

export const focusOnMediaFile = createAction(MediaFileActions.FocusOnMediaFile, (path: string) => {
  return {
    payload: {
      path,
    },
  };
});
