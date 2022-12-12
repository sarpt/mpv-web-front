import { createAction } from "@reduxjs/toolkit";
import { Playback } from "./models";

enum PlaybackActions {
  FetchPlayback = 'FetchMediaFiles',
  PlayMediaFile = 'PlayMediaFile',
  PlaybackFetched = 'PlaybackFetched',
  PlyabackFetchError = 'PlaybackFetchError',
  SubscribeToPlayback = 'SubscribeToPlayback',
}

export const fetchPlayback = createAction(PlaybackActions.FetchPlayback);

export const subscribeToPlayback = createAction(PlaybackActions.SubscribeToPlayback);

export const playMediaFile = createAction(PlaybackActions.PlayMediaFile, (mediaFilePath: string) => {
  return {
    payload: {
      mediaFilePath,
    },
  };
});

export const playbackFetched = createAction(PlaybackActions.PlaybackFetched, (playback: Playback) => {
  return {
    payload: {
      playback,
    },
  };
});

export const playbackFetchError = createAction(PlaybackActions.PlyabackFetchError, (errMsg: string) => {
  return {
    payload: {
      errMsg,
    },
  };
});
