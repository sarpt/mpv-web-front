import { writable } from 'svelte/store';

import type { Playback } from '../models/api';

export type PlaybackState = {
  playback?: Playback,
};

const initialState: PlaybackState = {};

export const playbackStore = writable(initialState);
