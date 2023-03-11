import { createSelectorCreator, defaultMemoize } from 'reselect';
import { createSelector } from "@reduxjs/toolkit"
import { selectStoreState } from "../../reducers";
import { MediaFilesMap } from './models';

const selectMediaFilesState = createSelector(selectStoreState, (state) => state.mediaFiles);

const getMediaFilesListIdentity = (mediaFiles: MediaFilesMap) => Object.keys(mediaFiles).join(';');
const createMediaFilesSelector = createSelectorCreator(
  defaultMemoize,
  (a: MediaFilesMap, b: MediaFilesMap): boolean => {
    return getMediaFilesListIdentity(a) === getMediaFilesListIdentity(b)
  }
)

const selectMediaFilesList = createSelector(
  selectMediaFilesState,
  (state) => state.mediaFiles
);

export const selectMediaFiles = createMediaFilesSelector(
  selectMediaFilesList,
  (mediaFilesMap) => mediaFilesMap,
);
