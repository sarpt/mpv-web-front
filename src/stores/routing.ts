import { writable } from 'svelte/store';
import { Routes } from '../functions/routing';

const defaultRoute = Routes.Root;

export type ApiAddressState = {
  route: Routes,
};

const initialState: ApiAddressState = {
  route: defaultRoute,
};

export const routingStore = writable(initialState);
