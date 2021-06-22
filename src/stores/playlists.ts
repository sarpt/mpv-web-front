import { writable } from 'svelte/store';

import type { Playlists } from '../models/api';

export type PlaylistsState = Playlists;

const initialState: PlaylistsState = {
  Items: {},
};

export const playlistsStore = writable(initialState);
