import { createAction } from "@reduxjs/toolkit";
import { Playback } from "./models";

enum PlaybackActions {
  Pause = 'Pause',
  FetchPlayback = 'FetchMediaFiles',
  PlayMediaFile = 'PlayMediaFile',
  PlaybackFetched = 'PlaybackFetched',
  PlyabackFetchError = 'PlaybackFetchError',
  SubscribeToPlayback = 'SubscribeToPlayback',
  UnsubscribeToPlayback = 'UnsubscribeToPlayback',
}

export const fetchPlayback = createAction(PlaybackActions.FetchPlayback);

export const subscribeToPlayback = createAction(PlaybackActions.SubscribeToPlayback);

export const unsubscribeToPlayback = createAction(PlaybackActions.UnsubscribeToPlayback);

export const playMediaFile = createAction(PlaybackActions.PlayMediaFile, (mediaFilePath: string) => {
  return {
    payload: {
      mediaFilePath,
    },
  };
});

export const pause = createAction(PlaybackActions.Pause, (paused: boolean) => {
  return {
    payload: {
      paused,
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
