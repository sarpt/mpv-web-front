import { writable } from 'svelte/store';

import type {
  MoviesMap,
} from '../models/api';

export type MoviesState = {
  movies: MoviesMap,
  isFetchingInProgress: boolean,
};

const initialState: MoviesState = {
  movies: {},
  isFetchingInProgress: false,
};

export const moviesStore = writable(initialState);
