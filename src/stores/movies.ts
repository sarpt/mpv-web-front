import { writable } from 'svelte/store';

import type {
  Movie,
} from '../models/api';

export type MoviesMap = { [key in string]: Movie };

export type MoviesState = {
  movies: MoviesMap,
  isFetchingInProgress: boolean,
};

const initialState: MoviesState = {
  movies: {},
  isFetchingInProgress: false,
};

export const moviesStore = writable(initialState);
