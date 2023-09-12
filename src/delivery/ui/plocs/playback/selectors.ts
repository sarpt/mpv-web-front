import { createSelector } from "@reduxjs/toolkit"
import { selectStoreState } from "../../reducers";

const selectPlaybackState = createSelector(selectStoreState, (state) => state.playback);

export const selectPlayback = createSelector(
  selectPlaybackState,
  (state) => state.playback
);

export const selectMediaFilePath = createSelector(
  selectPlayback,
  (playback) => playback?.MediaFilePath
);

export const selectCurrentTime = createSelector(
  selectPlayback,
  (playback) => playback?.CurrentTime
);

export const selectFullscreen = createSelector(
  selectPlayback,
  (playback) => playback?.Fullscreen
);

export const selectPaused = createSelector(
  selectPlayback,
  (playback) => playback?.Paused
);

export const selectSubtitleId = createSelector(
  selectPlayback,
  (playback) => playback?.SelectedSubtitleID
);

export const selectAudioId = createSelector(
  selectPlayback,
  (playback) => playback?.SelectedAudioID
);

export const selectLoopVariant = createSelector(
  selectPlayback,
  (playback) => playback?.Loop.Variant,
);

export const selectPlaylistUuid = createSelector(
  selectPlayback,
  (playback) => playback?.PlaylistUUID
);
