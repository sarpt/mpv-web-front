import { writable } from 'svelte/store';

const defaultAddress = 'localhost:3001';
const initialState = {
  address: defaultAddress,
};

export const apiAddress = writable(initialState);
