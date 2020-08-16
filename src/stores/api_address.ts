import { writable } from 'svelte/store';

const defaultAddress = 'localhost:3001';

export const apiAddress = writable(defaultAddress);
