// User interface
export interface IUser {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

export const StorageService = {
  TOKEN_KEY: "token",
  USER_KEY: "user",

  // Token methods
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(StorageService.TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(StorageService.TOKEN_KEY, token);
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(StorageService.TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = StorageService.getToken();
    const user = StorageService.getUser();
    return !!(token && user);
  },

  setUser: (user: IUser): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(StorageService.USER_KEY, JSON.stringify(user));
  },

  getUser: (): IUser | null => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(StorageService.USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  removeUser: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(StorageService.USER_KEY);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    StorageService.removeToken();
    StorageService.removeUser();
  },
};
