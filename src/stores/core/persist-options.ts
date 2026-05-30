import type { PersistOptions, PersistStorage } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { getBrowserStorage } from "./storage";

export const createPersistOptions = <
  S extends object,
  PersistedState extends object = S,
>(
  key: string,
  version: number,
  whitelist: Array<keyof S>,
): PersistOptions<S, PersistedState> => ({
  name: key,
  version,
  storage: createJSONStorage(() => getBrowserStorage()) as PersistStorage<
    PersistedState,
    unknown
  >,
  partialize: (state: S) => {
    const persisted = {} as Partial<S>;

    whitelist.forEach((property) => {
      if (property in state) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (persisted as any)[property] = (state as any)[property];
      }
    });

    return persisted as PersistedState;
  },
  migrate: async (persistedState, _currentVersion) =>
    persistedState as PersistedState,
});
