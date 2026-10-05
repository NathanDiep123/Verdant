export type Basemap = "map" | "satellite";

const KEY = "verdant.basemap";
const defaultStorage = (): Storage | undefined => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

export function loadBasemap(storage: Storage | undefined = defaultStorage()): Basemap {
  try {
    return storage?.getItem(KEY) === "satellite" ? "satellite" : "map";
  } catch {
    return "map";
  }
}

export function saveBasemap(b: Basemap, storage: Storage | undefined = defaultStorage()): void {
  try {
    storage?.setItem(KEY, b);
  } catch {
    // storage unavailable: choice stays in memory
  }
}
