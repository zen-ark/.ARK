// src/lib/playerStore.ts
import { atom } from 'nanostores';

export const activeProjectStore = atom<string | null>(null);

// Optional: Helper to update active project
export const setActiveProject = (id: string | null) => {
  activeProjectStore.set(id);
};
