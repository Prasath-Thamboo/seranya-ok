export class AppStorage {
    static setItem<T extends string | boolean | number | object>(key: string, value: T) {
      if (typeof window !== "undefined" && window.localStorage) {
        if (typeof value === "object") {
          window.localStorage.setItem(key, JSON.stringify(value));
        } else {
          window.localStorage.setItem(key, String(value));
        }
      }
    }
  
    static getItem<T extends string | boolean | number | object>(key: string): T | null {
      if (typeof window !== "undefined" && window.localStorage) {
        const storedValue = window.localStorage.getItem(key);
        if (storedValue) {
          try {
            return JSON.parse(storedValue) as T;
          } catch {
            return storedValue as T; // Retourne la valeur brute si ce n'est pas du JSON
          }
        }
      }
      return null;
    }
  
    static removeItem(key: string) {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    }
  }
  