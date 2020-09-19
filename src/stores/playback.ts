import { writable } from 'svelte/store';

import type { Playback } from '../models/api';

export type PlaybackState = {
  playback?: Playback,
  error: boolean,
};

const initialState: PlaybackState = {
  error: false,
};

export const playbackStore = writable(initialState);
