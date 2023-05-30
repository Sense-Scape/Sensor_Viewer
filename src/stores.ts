// <!-- stores.ts -->
import { writable } from 'svelte/store';

export const sampleRateStore = writable<number | null>(null);
