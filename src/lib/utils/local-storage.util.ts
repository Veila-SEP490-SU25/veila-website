export const isBrowser = typeof window !== 'undefined';

export const runOnlyInBrowser = (callback: () => void) => {
  if (isBrowser) {
    callback();
  }
};

export function getFromLocalStorage<T>(key: string): T | null {
  const item = isBrowser && window.localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  }
  return null;
}

export function setToLocalStorage<T>(key: string, value: T): void {
  if (isBrowser) {
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  }
}

export function removeFromLocalStorage(key: string): void {
  if (isBrowser) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  }
}

export function clearLocalStorage(): void {
  if (isBrowser) {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
