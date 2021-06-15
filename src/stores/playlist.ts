import { writable } from 'svelte/store';

import type { Playlist } from '../models/api';

export type PlaylistState = {
  playlist?: Playlist,
};

const initialState: PlaylistState = {};

export const playlistStore = writable(initialState);
