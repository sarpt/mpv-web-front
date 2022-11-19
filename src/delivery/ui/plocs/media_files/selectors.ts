import { createSelector } from "@reduxjs/toolkit"
import { selectStoreState } from "../../store"

const selectMediaFilesState = createSelector(selectStoreState, (state) => state.mediaFiles);

export const selectMediaFiles = createSelector(
  selectMediaFilesState,
  (state) => state.mediaFiles
);
