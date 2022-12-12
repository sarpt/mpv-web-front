import { createSelector } from "@reduxjs/toolkit"
import { selectStoreState } from "../../reducers";

const selectPlaybackState = createSelector(selectStoreState, (state) => state.playback);

export const selectPlayback = createSelector(
  selectPlaybackState,
  (state) => state.playback
);
