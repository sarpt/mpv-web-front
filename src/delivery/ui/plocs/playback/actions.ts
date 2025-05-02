import { createAction } from "@reduxjs/toolkit";

import { Playback } from "src/domains/playback/entities";

import { LoopVariant } from "./models";

enum PlaybackActions {
  ChangeAudio = 'ChangeAudio',
  ChangeSubtitles = 'ChangeSubtitles',
  FetchPlayback = 'FetchPlayback',
  Fullscreen = 'Fullscreen',
  LoadPlaylist = 'LoadPlaylist',
  Loop = 'Loop',
  Pause = 'Pause',
  PlaybackFetched = 'PlaybackFetched',
  PlyabackFetchError = 'PlaybackFetchError',
  PlayMediaFile = 'PlayMediaFile',
  SubscribeToPlayback = 'SubscribeToPlayback',
  UnsubscribeToPlayback = 'UnsubscribeToPlayback',
}

export const changeAudio = createAction(PlaybackActions.ChangeAudio, (audioId: string) => {
  return {
    payload: {
      audioId,
    },
  };
});

export const changeSubtitles = createAction(PlaybackActions.ChangeSubtitles, (subtitleId: string) => {
  return {
    payload: {
      subtitleId,
    },
  };
});

export const fetchPlayback = createAction(PlaybackActions.FetchPlayback);

export const subscribeToPlayback = createAction(PlaybackActions.SubscribeToPlayback);

export const unsubscribeToPlayback = createAction(PlaybackActions.UnsubscribeToPlayback);

type PlayMediaFileOpts = {
  append?: boolean,
  subtitleId?: string,
  audioId?: string,
  loopVariant: LoopVariant,
}
export const playMediaFile = createAction(PlaybackActions.PlayMediaFile, (mediaFilePath: string, opts?: PlayMediaFileOpts) => {
  return {
    payload: {
      mediaFilePath,
      append: opts?.append,
      subtitleId: opts?.subtitleId,
      audioId: opts?.audioId,
      loopVariant: opts?.loopVariant
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

export const fullscreen = createAction(PlaybackActions.Fullscreen, (enabled: boolean) => {
  return {
    payload: {
      enabled,
    },
  };
});

export const loop = createAction(PlaybackActions.Loop, (variant: LoopVariant) => {
  return {
    payload: {
      variant,
    },
  };
});

export const loadPlaylist = createAction(PlaybackActions.LoadPlaylist, (uuid: string) => {
  return {
    payload: {
      uuid,
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
