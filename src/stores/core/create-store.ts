import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import type { StateCreator } from "zustand";
import type { PersistOptions } from "zustand/middleware";

export const createStore = <T extends object>(
  initializer: StateCreator<T>,
  name?: string,
) => {
  return create<T>()(
    subscribeWithSelector(
      devtools(initializer, {
        name: name ?? "zustand-store",
        enabled: process.env.NODE_ENV !== "production",
      }),
    ),
  );
};

export const createPersistedStore = <
  T extends object,
  PersistedState extends object = T,
>(
  initializer: StateCreator<T>,
  persistConfig: PersistOptions<T, PersistedState>,
  name?: string,
) => {
  return create<T>()(
    subscribeWithSelector(
      devtools(persist(initializer, persistConfig), {
        name: name ?? "zustand-persist-store",
        enabled: process.env.NODE_ENV !== "production",
      }),
    ),
  );
};
