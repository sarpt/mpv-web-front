import { writable } from 'svelte/store';

const defaultAddress = 'localhost:3001';

export type ApiAddressState = {
  address: string,
};

const initialState: ApiAddressState = {
  address: defaultAddress,
};

export const apiAddressStore = writable(initialState);
