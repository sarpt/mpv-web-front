import { writable } from 'svelte/store';

export type ApiConnectionState = {
  connected: boolean,
};

const initialState: ApiConnectionState = {
  connected: true,
};

export const apiConnectionStore = writable(initialState);
