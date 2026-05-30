export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const createNoopStorage = (): StorageLike => ({
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
});

export const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const getBrowserStorage = (): StorageLike => {
  if (!isBrowser()) {
    return createNoopStorage();
  }

  return {
    getItem: (key: string) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // fail silently when storage is unavailable
      }
    },
    removeItem: (key: string) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // fail silently when storage is unavailable
      }
    },
  };
};
