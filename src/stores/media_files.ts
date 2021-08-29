import { writable } from 'svelte/store';

import type {
  MediaFilesMap,
} from '../models/api';

export type MediaFilesState = {
  mediaFiles: MediaFilesMap,
  isFetchingInProgress: boolean,
};

const initialState: MediaFilesState = {
  mediaFiles: {},
  isFetchingInProgress: false,
};

export const mediaFilesStore = writable(initialState);
