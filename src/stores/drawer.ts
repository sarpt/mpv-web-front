import { writable } from 'svelte/store';

export type DrawerState = {
  open: boolean,
}

const initialState: DrawerState = {
  open: false,
};

export const drawerStore = writable(initialState);
