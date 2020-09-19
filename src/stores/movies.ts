import { writable } from 'svelte/store';

import type {
  Movie,
} from '../models/api';

export type MoviesState = {
  movies: Movie[],
};

const initialState: MoviesState = {
  movies: [],
};

export const moviesStore = writable(initialState);
